interface TokenV2 {
  symbol: string;
  decimals: number;
  name: string;
  imageUrl: string;
  marketData: {
    price: number;
  };
}

export interface TokenDisplayItem {
  type: string;
  network: string;
  tokenAddress: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

interface ActorDisplayItem {
  account: {
    address: string;
  };
}

type StringDisplayItem =
  | {
      stringValue: string;
    }
  | undefined;

export interface Node {
  timestamp: number;
  network: string;
  transaction: {
    hash: string;
    fromUser: {
      address: string;
    };
  };
  interpretation: {
    processedDescription: string;
    descriptionDisplayItems: [
      TokenDisplayItem,
      ActorDisplayItem,
      StringDisplayItem,
    ];
  };
}

interface TimelineForApp {
  edges: {
    node: Node;
  }[];
  pageInfo: {
    startCursor: string;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    endCursor: string;
  };
}

export interface TipHistoryResponse {
  timelineForApp: TimelineForApp;
}
