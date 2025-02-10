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

interface ActorDisplayItem {
  account: {
    address: Hex;
  };
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
  };
  interpretation: {
    descriptionDisplayItems: [
      TokenDisplayItem | undefined,
      ActorDisplayItem | undefined,
      StringDisplayItem | undefined,
    ];
  };
}

interface TimelineForApp {
  edges: {
    node: Node;
  }[];
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

export interface TipHistoryResponse {
  timelineForApp: TimelineForApp;
}
