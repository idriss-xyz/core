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

interface TokenV2 {
  symbol: string;
  imageUrlV2?: string;
  onchainMarketData: {
    price: number;
  };
  address: Hex;
  decimals: number;
}

interface TokenDisplayItem {
  network: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

type StringDisplayItem = {
  stringValue: string;
};

export type FromUser = {
  address: Hex;
  displayName: {
    value: string;
    source: string;
  };
  avatar: {
    value: {
      url: string | undefined;
    };
    source: string | undefined;
  };
};

export interface ZapperNode {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: FromUser;
    toUser: {
      address: Hex;
    };
  };
  interpretation: {
    descriptionDisplayItems: [
      TokenDisplayItem | undefined,
      undefined,
      StringDisplayItem | undefined,
    ];
  };
  app?: {
    slug: string;
  };
}

export interface TipHistoryResponse {
  data: {
    node: ZapperNode;
  }[];
}
