import { EIP1193Provider } from 'mipd';
import { PublicKey, VersionedTransaction, Transaction } from '@solana/web3.js';

interface SolanaProvider {
  name: string;
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publicKey: PublicKey | null; // TODO: Check if it's string instead
  on(event: SolanaEvent, handler: (publicKey?: string) => void): void;
  removeListener(
    event: SolanaEvent,
    handler: (publicKey?: string) => void,
  ): void; // Optional to prevent runtime errors
  signTransaction?<T extends VersionedTransaction | Transaction>(
    transaction: T,
  ): Promise<T>;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    solana?: SolanaProvider;
  }
}
