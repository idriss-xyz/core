import { Hex, Chain as ViemChain } from 'viem';

import { TOKEN } from './constants';

type ClaimedEvent = {
  to: string;
  total: string;
  bonus: boolean;
  transactionHash: string;
};

export type ClaimedEventsResponse = {
  events: ClaimedEvent[];
  lastProcessedBlock: string;
};

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

export interface TipHistoryTokenV2 {
  symbol: string;
  imageUrlV2?: string;
  onchainMarketData: {
    price: number;
  };
  address: Hex;
  decimals: number;
}

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
  tokenV2: TipHistoryTokenV2;
}

type ReceiverDisplayItem = {
  account: TipHistoryFromUser;
};

type StringDisplayItem = {
  stringValue: string;
};

export type TipHistoryFromUser = {
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

export interface TipHistoryNode {
  timestamp: number;
  network: string;
  transaction: {
    hash: Hex;
    fromUser: TipHistoryFromUser;
    toUser: {
      address: Hex;
    };
  };
  interpretation: {
    descriptionDisplayItems: [
      TokenDisplayItem | undefined,
      ReceiverDisplayItem | undefined,
      StringDisplayItem | undefined,
    ];
  };
  app?: {
    slug: string;
  };
}

export interface TipHistoryResponse {
  donations: DonationData[];
  stats: DonationStats;
  leaderboard: LeaderboardStats[];
}

interface DonationData {
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

interface DonationStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  mostDonatedToAddress: Hex;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  favoriteTokenMetadata: Omit<TokenV2, 'onchainMarketData'> | null;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
}

interface LeaderboardStats {
  address: Hex;
  avatarUrl: string;
  displayName: string;
  totalAmount: number;
  donateLink?: string;
}

interface DonationUser {
  address: Hex;
  displayName?: string;
  displayNameSource?: string;
  avatarUrl?: string;
  avatarSource?: string;
}

interface DonationToken {
  address: Hex;
  symbol: string;
  imageUrl?: string;
  network: string;
  decimals: number;
}
