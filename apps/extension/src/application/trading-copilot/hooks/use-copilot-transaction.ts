import { useMutation } from '@tanstack/react-query';

import {
  createWalletClient,
  getChainById,
  Hex,
  TransactionRevertedError,
  Wallet,
} from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';

interface SwapProperties {
  to: `0x${string}`;
  chain: number;
  value: bigint;
  gas?: bigint;
  data: Hex;
}

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
