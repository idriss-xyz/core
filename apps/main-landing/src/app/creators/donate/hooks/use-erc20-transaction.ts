import { useMutation } from '@tanstack/react-query';
import { decodeFunctionResult, encodeFunctionData, WalletClient } from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';

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
  tokensToSend: bigint;
  recipientAddress: Hex;
  message: string;
}

export const useErc20Transaction = () => {
  return useMutation({
    mutationFn: async ({
      tokenAddress,
      walletClient,
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

      const encodedAllowanceData = encodeFunctionData(allowanceData);

      const allowanceRaw = await call(walletClient, {
        account,
        to: tokenAddress,
        data: encodedAllowanceData,
      });

      if (allowanceRaw.data === undefined) {
        throw new Error('Allowance data is not defined');
      }

      const allowanceNumber = decodeFunctionResult({
        abi: ERC20_ABI,
        functionName: 'allowance',
        data: allowanceRaw.data,
      });

      if (allowanceNumber < tokensToSend) {
        const approveData = {
          abi: ERC20_ABI,
          functionName: 'approve',
          args: [idrissTippingAddress, tokensToSend],
        } as const;

        const encodedData = encodeFunctionData(approveData);

        const gas = await estimateGas(walletClient, {
          account,
          to: tokenAddress,
          data: encodedData,
        }).catch((error) => {
          console.error('Error estimating gas:', error.message);
          throw error;
        });

        const transactionHash = await walletClient.sendTransaction({
          account,
          to: tokenAddress,
          chain: getChainById(chainId),
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

      const data = encodeFunctionData(sendTokenToData);

      const gas = await estimateGas(walletClient, {
        account,
        to: idrissTippingAddress,
        data: data,
      });

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
