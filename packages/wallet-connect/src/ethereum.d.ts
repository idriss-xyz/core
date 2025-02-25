import { EIP1193Provider } from 'mipd';
import { PublicKey } from '@solana/web3.js';

interface SolanaProvider {
  name: string;
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  publicKey: PublicKey | null; // TODO: Check if it's string instead
  on(event: SolanaEvent, handler: (publicKey?: string) => void): void;
  removeListener(event: SolanaEvent, handler: (publicKey?: string) => void): void; // Optional to prevent runtime errors
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    solana?: SolanaProvider;
  }
}
