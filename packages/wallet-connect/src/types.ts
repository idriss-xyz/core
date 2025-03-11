import { EIP1193Provider } from 'mipd';
import { Hex } from 'viem';

import { SolanaProvider } from './ethereum';

export type Wallet = {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
  providerRdns: string;
};

export type SolanaWallet = {
  account: string;
  provider: SolanaProvider;
};

export type SolanaProviderInfo = {
  name: string;
}

export type StoredWallet = {
  account: Hex;
  providerRdns: string;
};

export interface StoredSolanaWallet {
  account: string;
  providerName: string;
}
