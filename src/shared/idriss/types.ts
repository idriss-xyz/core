import { Hex } from 'shared/web3';

export interface SendFormValues {
  chainId: number;
  tokenAddress: Hex;
  amount: number;
}

export type IdrissIdentifierType = 'EMAIL' | 'PHONE' | 'TWITTER' | 'UNKNOWN';
