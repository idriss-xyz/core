import { Chain as ViemChain } from 'viem';

import { TOKEN } from './constants';

export type Hex = `0x${string}`;

export type Chain = ViemChain & { logo: string; shortName: string };
export interface Token {
  name: string;
  logo: string;
  symbol: string;
}

export interface ChainToken extends Token {
  decimals: number;
  address: Hex;
}

export type TokenSymbol = (typeof TOKEN)[keyof typeof TOKEN]['symbol'];
