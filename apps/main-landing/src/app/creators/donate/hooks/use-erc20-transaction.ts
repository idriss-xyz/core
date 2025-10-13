import { useMutation } from '@tanstack/react-query';
import {
  Hex,
  WalletClient,
  encodeFunctionData,
  decodeFunctionResult,
} from 'viem';
import { call, estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  EMPTY_HEX,
  ERC20_ABI,
  TIPPING_ABI,
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
} from '@idriss-xyz/constants';
import { getChainById } from '@idriss-xyz/utils';

interface Properties {
  chainId: number;
  message: string;
  tokenAddress: Hex;
  tokensToSend: bigint;
  recipientAddress: Hex;
  walletClient: WalletClient;
  callbackOnSend?: (txHash: string) => void;
}

export const useErc20Transaction = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      message,
      tokenAddress,
      walletClient,
      tokensToSend,
      recipientAddress,
      callbackOnSend,
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
        data: allowanceRaw.data,
        functionName: 'allowance',
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
          gas,
          account,
          to: tokenAddress,
          data: encodedData,
          chain: getChainById(chainId),
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
        data: data,
        to: idrissTippingAddress,
      });

      const transactionHash = await walletClient.sendTransaction({
        account,
        gas,
        data: data,
        to: idrissTippingAddress,
        chain: getChainById(chainId),
      });

      callbackOnSend?.(transactionHash);

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
