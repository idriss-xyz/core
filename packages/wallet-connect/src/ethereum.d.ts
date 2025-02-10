import { EIP1193Provider } from 'mipd';

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(): Promise<{ publicKey: { toString(): string } }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signMessage(message: Uint8Array): Promise<any>;
  publicKey?: { toString(): string };
  on(event: SolanaEvent, handler: (publicKey?: { toString(): string }) => void): void
  removeListener(event: "connect" | "disconnect" | "accountChanged", handler: (publicKey?: { toString(): string }) => void): void;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    solana?: SolanaProvider;
  }
}
