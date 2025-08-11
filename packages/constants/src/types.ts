import { Hex, Chain as ViemChain } from 'viem';

type ClaimedEvent = {
  to: string;
  total: string;
  bonus: boolean;
  transactionHash: string;
};

export interface TokenBalance {
  address: Hex;
  symbol: string;
  name: string;
  imageUrl?: string;
  network: string;
  decimals: number;
  balance: string;
  usdValue: number;
}

export type ClaimedEventsResponse = {
  events: ClaimedEvent[];
  lastProcessedBlock: string;
};

export type Chain = ViemChain & {
  logo: string;
  shortName: string;
  dbName: string;
};

export interface Token {
  name: string;
  logo: string;
  symbol: string;
}

export interface ChainToken extends Token {
  decimals: number;
  address: Hex;
}

export interface TipHistoryTokenV2 {
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

export interface LeaderboardStats extends DonationUser {
  totalAmount: number;
  donateLink?: string;
  donorSince?: number;
  donationCount?: number;
}

export interface DonationUser {
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
  name?: string;
}

export interface BalanceTableItem {
  totalAmount: number;
  totalValue: number;
  token: DonationToken;
}
