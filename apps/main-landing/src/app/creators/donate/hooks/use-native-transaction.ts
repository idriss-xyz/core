import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData, PublicClient, WalletClient } from 'viem';
import { Hex } from '@idriss-xyz/wallet-connect';
import { waitForTransactionReceipt } from 'viem/actions';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  EMPTY_HEX,
  TIPPING_ABI,
} from '../constants';
import { getChainById } from '../utils';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: bigint;
  walletClient: WalletClient;
  publicClient: PublicClient;
  chainId: number;
  message: string;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      recipientAddress,
      tokensToSend,
      walletClient,
      publicClient,
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

      const gas = await publicClient.estimateContractGas({
        ...sendToData,
        address: idrissTippingAddress,
        account,
        value: tokensToSend,
      });

      const encodedData = encodeFunctionData(sendToData);

      const transactionHash = await walletClient.sendTransaction({
        account,
        chain: getChainById(chainId),
        data: encodedData,
        value: tokensToSend,
        to: idrissTippingAddress,
        gas,
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
