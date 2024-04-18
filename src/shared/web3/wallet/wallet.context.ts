import { createContext } from 'react';

import { Wallet } from './wallet.types';

export interface WalletContextValue {
  wallet?: Wallet;
  openConnectionModal: () => Promise<Wallet>;
  isConnectionModalOpened: boolean;
}

export const WalletContext = createContext<WalletContextValue | undefined>(
  undefined,
);
