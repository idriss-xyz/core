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

interface AccountsTimeline {
  edges: {
    node: Node;
  }[];
}

export interface TipHistoryResponse {
  data: { accountsTimeline: AccountsTimeline };
}
