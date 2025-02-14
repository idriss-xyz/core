import { useMutation } from '@tanstack/react-query';

import {
  createWalletClient,
  getChainById,
  Hex,
  TransactionRevertedError,
  Wallet,
} from 'shared/web3';
import { useObservabilityScope } from 'shared/observability';
import { Connection, Transaction, VersionedTransaction } from '@solana/web3.js';

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
  connection: Connection;
  signTransaction?: (<T extends VersionedTransaction | Transaction>(transaction: T) => Promise<T>) | undefined;
}

export const useCopilotSolanaTransaction = () => {
  const observabilityScope = useObservabilityScope();
  return useMutation({
    mutationFn: async ({ transactionData, connection, signTransaction }: SolanaCopilotProperties) => {

      try {
        const decodedTx = Buffer.from(transactionData.data.toString(), 'base64');
        const deserializedTx = VersionedTransaction.deserialize(new Uint8Array(decodedTx));
        const signedTransaction = await signTransaction?.(deserializedTx);
        const serializedTx = signedTransaction?.serialize();

        if (!serializedTx) {
          throw new Error('Failed to sign transaction');
        }

        const transactionHash = await connection.sendRawTransaction(serializedTx);

        const latestBlockhash = await connection.getLatestBlockhash();

        const receipt = await connection.confirmTransaction(
            {
                signature: transactionHash,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
            },
            "finalized"
        );

        console.log("Transaction Confirmation Result:", receipt);

        if (receipt.value.err) {
          const error = new TransactionRevertedError({ transactionHash });
          observabilityScope.captureException(error);
          throw error;
        }

        return { transactionHash };
      }
      catch (error) {
          observabilityScope.captureException(error);
          throw error;
      }

    },
  });
}
