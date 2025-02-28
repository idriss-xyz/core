import { Hex } from 'viem';

export interface TokenV2 {
  symbol: string;
  imageUrlV2?: string;
  onchainMarketData: {
    price: number;
  };
  address: Hex;
  decimals: number;
}

export interface DonationStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  mostDonatedToAddress: string;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  favoriteTokenMetadata: Omit<TokenV2, 'onchainMarketData'> | null;
  donorDisplayName: string | null;
}

export interface ActorDisplayItem {
  account: {
    address: Hex;
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

export interface ZapperNode {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: {
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
    toUser: {
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
  app?: {
    slug: string;
  };
}

export interface TipHistoryVariables {
  addresses: string[];
  toAddresses: string[];
  isSigner: boolean;
  after?: string | null;
}

interface AccountsTimeline {
  edges: {
    node: ZapperNode;
  }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export interface ZapperResponse {
  data: { accountsTimeline: AccountsTimeline };
}
