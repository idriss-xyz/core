import { Hex } from 'viem';

interface TokenV2 {
  symbol: string;
  imageUrlV2?: string;
  marketData: {
    price: number;
  };
}

export interface TokenDisplayItem {
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
      StringDisplayItem | undefined,
    ];
  };
}

interface AccountsTimeline {
  edges: {
    node: Node;
  }[];
}

export interface TipHistoryResponse {
  accountsTimeline: AccountsTimeline;
}
