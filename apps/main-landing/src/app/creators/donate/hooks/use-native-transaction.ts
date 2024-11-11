import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';
import { Hex, Wallet } from '@idriss-xyz/wallet-connect';

import {
  CHAIN_TO_IDRISS_TIPPING_ADDRESS,
  EMPTY_HEX,
  TIPPING_ABI,
} from '../constants';
import { createWalletClient, getChainById } from '../utils';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: bigint;
  wallet: Wallet;
  chainId: number;
  message: string;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      recipientAddress,
      tokensToSend,
      wallet,
      chainId,
      message,
    }: Properties) => {
      const walletClient = createWalletClient(wallet);

      const idrissTippingAddress =
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? EMPTY_HEX;

      const sendToData = {
        abi: TIPPING_ABI,
        functionName: 'sendTo',
        args: [recipientAddress, tokensToSend, message],
      } as const;

      const gas = await walletClient.estimateContractGas({
        ...sendToData,
        address: idrissTippingAddress,
        account: wallet.account,
        value: tokensToSend,
      });

      const encodedData = encodeFunctionData(sendToData);

      const transactionHash = await walletClient.sendTransaction({
        chain: getChainById(chainId),
        data: encodedData,
        value: tokensToSend,
        to: idrissTippingAddress,
        gas,
      });

      const receipt = await walletClient.waitForTransactionReceipt({
        hash: transactionHash,
      });

      if (receipt.status === 'reverted') {
        throw new Error('tx reverted');
      }

      return { transactionHash };
    },
  });
};
