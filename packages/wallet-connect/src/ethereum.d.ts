import { EIP1193Provider } from 'mipd';

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(): Promise<{ publicKey: string }>;
  disconnect(): Promise<void>;
  publicKey?: string;
  on(event: SolanaEvent, handler: (publicKey?: string) => void): void;
  removeListener(
    event: 'connect' | 'disconnect' | 'accountChanged',
    handler: (publicKey?: string) => void,
  ): void;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    solana?: SolanaProvider;
  }
}
