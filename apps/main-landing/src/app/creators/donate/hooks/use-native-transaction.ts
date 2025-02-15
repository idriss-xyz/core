import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, Hex, WalletClient } from 'viem';
import { estimateGas, waitForTransactionReceipt } from 'viem/actions';
import { getChainById, EMPTY_HEX } from '@idriss-xyz/constants';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS, TIPPING_ABI } from '../constants';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: bigint;
  walletClient: WalletClient;
  chainId: number;
  message: string;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      recipientAddress,
      tokensToSend,
      walletClient,
      chainId,
      message,
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
        args: [recipientAddress, tokensToSend, message],
      } as const;

      const encodedData = encodeFunctionData(sendToData);

      const gas = await estimateGas(walletClient, {
        to: idrissTippingAddress,
        account,
        value: tokensToSend,
        data: encodedData,
      }).catch((error) => {
        console.error('Error estimating gas:', error.message);
        throw error;
      });

      const transactionHash = await walletClient
        .sendTransaction({
          account,
          chain: getChainById(chainId),
          data: encodedData,
          value: tokensToSend,
          to: idrissTippingAddress,
          gas,
        })
        .catch((error) => {
          console.error('Error sending transaction:', error.message);
          throw error;
        });

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
