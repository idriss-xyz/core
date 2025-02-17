import { Hex } from 'viem';

export interface SendFormValues {
  chainId: number;
  tokenAddress: Hex;
  amount: number;
}

export type IdrissIdentifierType = 'EMAIL' | 'PHONE' | 'TWITTER' | 'UNKNOWN';
