import { Wallet as SolanaWalletWeb3js } from '@solana/wallet-adapter-react';
import {
  isWalletAdapterCompatibleWallet,
  StandardWalletAdapter,
} from '@solana/wallet-standard-wallet-adapter-base';
import { DEPRECATED_getWallets } from '@wallet-standard/app';
import type { Wallet } from '@wallet-standard/base';

function wrapWalletsWithAdapters(
  wallets: readonly Wallet[],
): readonly StandardWalletAdapter[] {
  return wallets
    .filter((wallet) => {return isWalletAdapterCompatibleWallet(wallet)})
    .map((wallet) => {return new StandardWalletAdapter({ wallet })});
}

// Function to detect browser-installed Solana wallets
function detectSolanaWallets(): SolanaWalletWeb3js[] {
  const detectedWallets: SolanaWalletWeb3js[] = [];
  if (typeof window !== 'undefined') {
    const { get } = DEPRECATED_getWallets();
    const wallets = wrapWalletsWithAdapters(get());
    const potentialWallets = wallets.filter(
      (wallet) => {return wallet && typeof wallet === 'object'},
    );

    const mappedWallets = potentialWallets.map((adapter) => {return {
      adapter,
      readyState: adapter.readyState || 'Unknown', // Fallback if readyState is not available
    }});

    detectedWallets.push(...mappedWallets);
  }

  console.log('Detected Solana Wallets:', detectedWallets);

  return detectedWallets;
}

// Function to create a provider store for Solana wallets
// Replaces createStore from mipd
export function createSolanaWalletStore() {
  let wallets: SolanaWalletWeb3js[] = detectSolanaWallets();
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
