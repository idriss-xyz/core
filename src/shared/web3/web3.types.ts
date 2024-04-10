import { EIP1193Provider } from 'mipd';

export interface Wallet {
  provider: EIP1193Provider;
  account: Hex;
  chainId: number;
}

export type Hex = `0x${string}`;
