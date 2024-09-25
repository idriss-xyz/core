import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';

import {
  createWalletClient,
  EMPTY_HEX,
  getChainById,
  Hex,
  Wallet,
} from 'shared/web3';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS, TIPPING_ABI } from '../constants';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: bigint;
  wallet: Wallet;
  chainId: number;
}

export const useNativeTransaction = () => {
  return useMutation({
    mutationFn: async ({
      recipientAddress,
      tokensToSend,
      wallet,
      chainId,
    }: Properties) => {
      const walletClient = createWalletClient(wallet);

      const idrissTippingAddress =
        CHAIN_TO_IDRISS_TIPPING_ADDRESS[chainId] ?? EMPTY_HEX;

      const sendToData = {
        abi: TIPPING_ABI,
        functionName: 'sendTo',
        args: [recipientAddress, tokensToSend, ''],
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

      await walletClient.waitForTransactionReceipt({ hash: transactionHash });

      return { transactionHash };
    },
  });
};
