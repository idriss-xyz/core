import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, Hex, WalletClient } from 'viem';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';
import {
  EMPTY_HEX,
  TIPPING_ABI,
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  BASE_SUFFIX,
} from '@idriss-xyz/constants';
import { getChainById } from '@idriss-xyz/utils';

interface Properties {
  chainId: number;
  message: string;
  tokensToSend: bigint;
  recipientAddress: Hex;
  walletClient: WalletClient;
  callbackOnSend?: (txHash: string) => void;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      chainId,
      message,
      tokensToSend,
      walletClient,
      recipientAddress,
      callbackOnSend,
    }: Properties) => {
      const [account] = await walletClient.getAddresses();

      if (account === undefined) {
        throw new Error('no account connected');
      }

      const idrissTippingAddress =
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? EMPTY_HEX;

      const sendToData = {
        abi: TIPPING_ABI,
        functionName: 'sendTo',
        args: [recipientAddress, message],
      } as const;

      const encodedData = (encodeFunctionData(sendToData) +
        BASE_SUFFIX.slice(2)) as Hex;

      const gas = await estimateGas(walletClient, {
        account,
        data: encodedData,
        value: tokensToSend,
        to: idrissTippingAddress,
      }).catch((error) => {
        console.error('Error estimating gas:', error.message);
        throw error;
      });

      const transactionHash = await walletClient
        .sendTransaction({
          gas,
          account,
          data: encodedData,
          value: tokensToSend,
          to: idrissTippingAddress,
          chain: getChainById(chainId),
        })
        .catch((error) => {
          console.error('Error sending transaction:', error.message);
          throw error;
        });

      callbackOnSend?.(transactionHash);

      const receipt = await waitForTransactionReceipt(walletClient, {
        hash: transactionHash,
      });

      if (receipt.status === 'reverted') {
        throw new Error('tx reverted');
      }

      return { transactionHash };
    },
  });
};
