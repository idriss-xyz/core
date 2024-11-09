import { EIP1193Provider } from 'mipd';

export type Hex = `0x${string}`;

export type Wallet = {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
  providerRdns: string;
};
