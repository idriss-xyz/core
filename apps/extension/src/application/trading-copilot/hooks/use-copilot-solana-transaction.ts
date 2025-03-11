import { VersionedTransaction } from '@solana/web3.js';
import { SolanaWallet } from '@idriss-xyz/wallet-connect';

import { useCommandMutation } from 'shared/messaging';

import { SendSolanaTransactionCommand } from '../commands/';
import { useObservabilityScope } from 'shared/observability';
import { useMutation } from '@tanstack/react-query';
import { SwapProperties } from '../types';

interface SolanaCopilotProperties {
  transactionData: SwapProperties;
  wallet: SolanaWallet;
}

export const useCopilotSolanaTransaction = () => {
  const sendTxMutation = useCommandMutation(SendSolanaTransactionCommand);
  const observabilityScope = useObservabilityScope();

  return useMutation({
    mutationFn: async ({
      transactionData,
      wallet,
    }: SolanaCopilotProperties) => {
      try {
        if (!wallet.provider.connected) {
          await wallet.provider.connect();
        }

        const decodedTx = Buffer.from(
          transactionData.data.toString(),
          'base64',
        );
        const deserializedTx = VersionedTransaction.deserialize(
          new Uint8Array(decodedTx),
        );
        const signedTransaction =
          await wallet.provider.signTransaction?.(deserializedTx);
        const serializedTx = signedTransaction?.serialize();

        if (!serializedTx) {
          throw new Error('Failed to sign transaction');
        }

        const base64SerializedTx = Buffer.from(serializedTx).toString('base64');
        const response = await sendTxMutation.mutateAsync({
          base64SerializedTx: base64SerializedTx,
        });
        const transactionHash = response.transactionHash;

        return { transactionHash };
      } catch (error) {
        console.error('Error:', error);
        observabilityScope.captureException(error);
        throw error;
      }
    },
  });
};
