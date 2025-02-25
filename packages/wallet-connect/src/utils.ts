import { Wallet as SolanaWalletWeb3js } from '@solana/wallet-adapter-react';

// Function to create a provider store for Solana wallets
// Replaces createStore from mipd
export function createSolanaWalletStore() {
  let wallets: SolanaWalletWeb3js[] = [];
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        return listeners.delete(listener);
      };
    },
    getProviders() {
      return wallets;
    },
    addProvider(provider: SolanaWalletWeb3js) {
      wallets.push(provider);
      for (const listener of listeners) listener();
    },
    clear() {
      wallets = [];
      for (const listener of listeners) listener();
    },
  };
}
