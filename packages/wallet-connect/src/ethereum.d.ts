import { EIP1193Provider } from 'mipd';

interface SolanaProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  connect(): Promise<{ publicKey: string }>;
  disconnect(): Promise<void>;
  signTransaction(transaction: any): Promise<any>;
  signMessage(message: Uint8Array): Promise<any>;
  signAndSendTransaction(transaction: any, connection: any, options?: any): Promise<string>;
  publicKey?: string;
  on(event: SolanaEvent, handler: (publicKey?: string) => void): void
  removeListener(event: "connect" | "disconnect" | "accountChanged", handler: (publicKey?: string) => void): void;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
    solana?: SolanaProvider;
  }
}
