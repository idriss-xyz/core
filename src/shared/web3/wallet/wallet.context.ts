import { createContext } from 'react';

import { Wallet } from '../web3.types';

export interface WalletContextValue {
  wallet?: Wallet;
  openConnectionModal: () => Promise<Wallet>;
}

export const WalletContext = createContext<WalletContextValue | undefined>(
  undefined,
);
