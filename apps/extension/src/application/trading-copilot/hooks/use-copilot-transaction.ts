import { useMutation } from '@tanstack/react-query';
import { getChainById } from '@idriss-xyz/utils';
import { Wallet } from '@idriss-xyz/wallet-connect';

import { createWalletClient, TransactionRevertedError } from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';
import { SwapProperties } from '../types';

interface Properties {
  wallet: Wallet;
  transactionData: SwapProperties;
}

export const useCopilotTransaction = () => {
  const observabilityScope = useObservabilityScope();

  return useMutation({
    mutationFn: async ({ wallet, transactionData }: Properties) => {
      const walletClient = createWalletClient(wallet);
      const { chain: chainId, ...rest } = transactionData;

      const transactionHash = await walletClient.sendTransaction({
        ...rest,
        chain: getChainById(chainId),
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
