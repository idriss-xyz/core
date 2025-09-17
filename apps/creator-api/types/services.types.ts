import { Hex } from 'viem';
import {
  StoredDonationData,
  DonationToken,
  DonationUser,
  LeaderboardStats,
} from '@idriss-xyz/constants';
import { LAMBDA_FAUCET, LAMBDA_REWARDS } from '../config/aws-config';

export interface TokenDisplayItem {
  network: string;
  amountRaw: string;
  tokenV2: TokenV2;
}

export interface NftDisplayItem {
  tokenId: number;
  type: string;
  collectionAddress: Hex;
  quantity: number;
  nftToken: {
    metadata: { uri: string };
    name: string;
  };
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
  priceData: {
    price: number;
  };
  address: Hex;
  decimals: number;
  name: string;
}

export interface DonationStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  totalNftDonationAmount: number;
  mostDonatedToAddress: Hex;
  mostDonatedToUser: DonationUser;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  favoriteTokenMetadata: DonationToken | null;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
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
      TokenDisplayItem | NftDisplayItem,
      ActorDisplayItem | undefined,
      StringDisplayItem | undefined,
    ];
  };
  app?: {
    slug: string;
  };
}

export interface AppHistoryVariables {
  slug: string;
  after?: string | null;
}

interface AppTimeline {
  edges: {
    node: ZapperNode;
  }[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

export interface ZapperResponse {
  data: { transactionsForAppV2: AppTimeline };
}

export interface TipHistoryResponse {
  donations: StoredDonationData[];
  leaderboard: LeaderboardStats[];
}

export interface TokenEarnings {
  tokenData: DonationToken;
  totalAmount: number;
  donationCount: number;
}

export interface DonationWithTimeAndAmount {
  year: number;
  month: string;
  amount: number;
}

export interface RecipientDonationStats {
  distinctDonorsCount: number;
  totalDonationsCount: number;
  biggestDonation: number;
  donationsWithTimeAndAmount: DonationWithTimeAndAmount[];
  earningsByTokenOverview: TokenEarnings[];
}

export type LambdaName = typeof LAMBDA_FAUCET | typeof LAMBDA_REWARDS;

export type LambdaPayload = {
  recipient: Hex;
  amount: string | bigint;
  chainId: string;
  nonce: number;
};

export type LambdaResponse = {
  Payload?: Uint8Array;
  FunctionError?: string;
};

export type DecodedLambdaBody = Record<string, any>;
