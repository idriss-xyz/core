import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, PublicClient, WalletClient } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  EMPTY_HEX,
  ERC20_ABI,
  TIPPING_ABI,
} from '../constants';
import { Hex } from '../types';
import { getChainById } from '../utils';

interface Properties {
  tokenAddress: Hex;
  chainId: number;
  walletClient: WalletClient;
  publicClient: PublicClient;
  tokensToSend: bigint;
  recipientAddress: Hex;
  message: string;
}

export const useErc20Transaction = () => {
  return useMutation({
    mutationFn: async ({
      tokenAddress,
      walletClient,
      publicClient,
      chainId,
      tokensToSend,
      recipientAddress,
      message,
    }: Properties) => {
      const [account] = await walletClient.getAddresses();

      if (account === undefined) {
        throw new Error('no account connected');
      }

      const idrissTippingAddress =
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? EMPTY_HEX;

      const allowanceData = {
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [account, idrissTippingAddress],
      } as const;
      const allowance = await publicClient.readContract({
        ...allowanceData,
        address: tokenAddress,
      });

      if (allowance < tokensToSend) {
        const approveData = {
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [idrissTippingAddress, tokensToSend],
        } as const;
        const gas = await publicClient.estimateContractGas({
          ...approveData,
          address: tokenAddress,
          account,
        });

        const encodedData = encodeFunctionData(approveData);

        const transactionHash = await walletClient.sendTransaction({
          account,
          chain: getChainById(chainId),
          to: tokenAddress,
          data: encodedData,
          gas,
        });

        const receipt = await waitForTransactionReceipt(walletClient, {
          hash: transactionHash,
        });

        if (receipt.status === 'reverted') {
          throw new Error('reverted');
        }
      }

      const sendTokenToData = {
        abi: TIPPING_ABI,
        functionName: 'sendTokenTo',
        args: [recipientAddress, tokensToSend, tokenAddress, message],
      } as const;

      const gas = await publicClient.estimateContractGas({
        ...sendTokenToData,
        address: idrissTippingAddress,
        account,
      });

      const data = encodeFunctionData(sendTokenToData);

      const transactionHash = await walletClient.sendTransaction({
        account,
        chain: getChainById(chainId),
        data: data,
        to: idrissTippingAddress,
        gas,
      });
      const receipt = await waitForTransactionReceipt(walletClient, {
        hash: transactionHash,
      });

      if (receipt.status === 'reverted') {
        throw new Error('reverted');
      }

      return { transactionHash };
    },
  });
};
