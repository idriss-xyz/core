import { Hex } from 'viem';

interface TokenDisplayItem {
  network: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

interface DonationUser {
  address: Hex;
  displayName?: string;
  displayNameSource?: string;
  avatarUrl?: string;
  avatarSource?: string;
}

export interface DonationToken {
  address: Hex;
  symbol: string;
  imageUrl?: string;
  network: string;
  decimals: number;
}

type StringDisplayItem = {
  stringValue: string;
};

interface ActorDisplayItem {
  account: UserData;
}

export interface FarcasterUserData {
  username: string;
  metadata: {
    displayName: string;
    imageUrl: string | undefined;
  };
}

type UserData = {
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
  farcasterProfile: FarcasterUserData | undefined;
};

interface TokenV2 {
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
  mostDonatedToAddress: Hex;
  mostDonatedToUser: DonationUser;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  favoriteTokenMetadata: DonationToken | null;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
}

export interface LeaderboardStats {
  address: Hex;
  avatarUrl: string;
  displayName: string;
  totalAmount: number;
  donateLink?: string;
  donorSince?: number;
  donationCount?: number;
}

export interface ZapperNode {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: UserData;
    toUser: {
      address: Hex;
    };
    decodedInputV2: {
      data: {
        value: string;
        name: string;
      }[];
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
  addresses: Hex[];
  toAddresses: Hex[];
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

export interface TipHistoryResponse {
  donations: DonationData[];
  leaderboard: LeaderboardStats[];
}

export interface DonationData {
  transactionHash: Hex;
  fromAddress: Hex;
  toAddress: Hex;
  timestamp: number;
  comment?: string;
  tradeValue: number;
  tokenAddress: Hex;
  network: string;
  fromUser: DonationUser;
  toUser: DonationUser;
  token: DonationToken;
  amountRaw: string;
}
