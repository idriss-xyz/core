import { useMutation } from '@tanstack/react-query';

import {
  createWalletClient,
  getChainById,
  Hex,
  TransactionRevertedError,
  Wallet,
} from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';
import { Transaction, VersionedTransaction } from '@solana/web3.js';
import { useCommandMutation } from 'shared/messaging';
import { SendSolanaTransactionCommand } from '../commands/';

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

interface SolanaCopilotProperties {
  transactionData: SwapProperties;
  signTransaction?: (<T extends VersionedTransaction | Transaction>(transaction: T) => Promise<T>) | undefined;
}

export const useCopilotSolanaTransaction = () => {
  const sendTxMutation = useCommandMutation(SendSolanaTransactionCommand);
  const observabilityScope = useObservabilityScope();

  return useMutation({
    mutationFn: async ({ transactionData, signTransaction }: SolanaCopilotProperties) => {

      try {
        const decodedTx = Buffer.from(transactionData.data.toString(), 'base64');
        const deserializedTx = VersionedTransaction.deserialize(new Uint8Array(decodedTx));
        const signedTransaction = await signTransaction?.(deserializedTx);
        const serializedTx = signedTransaction?.serialize();

        if (!serializedTx) {
          throw new Error('Failed to sign transaction');
        }

        const base64SerializedTx = Buffer.from(serializedTx).toString('base64');
        const res = await sendTxMutation.mutateAsync({base64SerializedTx: base64SerializedTx});
        const transactionHash = res.transactionHash;

        return { transactionHash };
      }
      catch (error) {
          console.error('Error: ', error);
          observabilityScope.captureException(error);
          throw error;
      }

    },
  });
}
