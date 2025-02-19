import { EIP1193Provider } from 'mipd';
import { Hex } from 'viem';

export type Wallet = {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
  providerRdns: string;
};

export type StoredWallet = {
  account: Hex;
  providerRdns: string;
};
