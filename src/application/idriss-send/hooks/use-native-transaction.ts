import { useMutation } from '@tanstack/react-query';
import { encodeFunctionData } from 'viem';

import {
  createWalletClient,
  EMPTY_HEX,
  getChainById,
  Hex,
  TransactionRevertedError,
  Wallet,
} from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';

import { CHAIN_TO_IDRISS_TIPPING_ADDRESS, TIPPING_ABI } from '../constants';

interface Properties {
  recipientAddress: Hex;
  tokensToSend: bigint;
  wallet: Wallet;
  chainId: number;
}

export const useNativeTransaction = () => {
  const observabilityScope = useObservabilityScope();

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

      const receipt = await walletClient.waitForTransactionReceipt({
        hash: transactionHash,
      });

      if (receipt.status === 'reverted') {
        const error = new TransactionRevertedError({ transactionHash });
        observabilityScope.captureException(error);
        throw error;
      }

      return { transactionHash };
    },
  });
};
