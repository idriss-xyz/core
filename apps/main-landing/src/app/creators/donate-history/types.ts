import { Hex } from 'viem';

interface TokenV2 {
  symbol: string;
  imageUrlV2?: string;
  marketData: {
    price: number;
  };
}

interface TokenDisplayItem {
  network: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

type StringDisplayItem = {
  stringValue: string;
};

export interface Node {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: {
      address: Hex;
    };
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

export interface TipHistoryVariables {
  addresses: string[];
  isSigner: boolean;
  after?: string | null;
}

interface AccountsTimeline {
  edges: {
    node: Node;
  }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export interface ZapperResponse {
  data: { accountsTimeline: AccountsTimeline };
}

export interface TipHistoryResponse {
  data: {
    node: Node;
  }[];
}
