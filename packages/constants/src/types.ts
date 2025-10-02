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

export interface NftCollection {
  address: Hex;
  name: string;
  standard: 'erc1155' | 'erc721';
  slug: string;
  image: string;
  shortName: string;
  category: string;
}

export interface NftOption {
  tokenId: string;
  name: string;
  image: string;
  balance: string;
  type: 'erc721' | 'erc1155';
}

export interface CollectionOption {
  address: Hex;
  chainId: number;
  name: string;
  image: string;
  usdValue: number;
  itemsCount: number;
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
  donations: StoredDonationData[];
  leaderboard: LeaderboardStats[];
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

/* ────────────── common donation shape ────────────── */
interface BaseDonationData {
  transactionHash: Hex;
  fromAddress: Hex;
  toAddress: Hex;
  timestamp: number;
  comment?: string;
  tradeValue: number;
  fromUser: DonationUser;
  toUser: DonationUser;
}

/* ────────────── token donation ────────────── */
export interface TokenDonationData extends BaseDonationData {
  kind: 'token';
  tokenAddress: Hex;
  amountRaw: string;
  network: string;
  token: DonationToken;
}

/* ────────────── nft donation ──────────────── */
export interface NftDonationData extends BaseDonationData {
  kind: 'nft';
  collectionAddress: Hex;
  tokenId: number;
  quantity: number;
  network: string;

  /* token-level meta */
  name: string;
  imgSmall?: string;
  imgMedium?: string;
  imgLarge?: string;
  imgPreferred?: string;

  /* collection-level meta */
  collectionShortName: string;
  collectionSlug: string;
  collectionCategory: string;
}

export type NftBalance = {
  chainId: number;
  contract: Hex;
  collection: string;
  tokenId: string;
  balance: string;
  type: 'erc721' | 'erc1155';

  /* token meta */
  name: string;
  imgSmall?: string;
  imgMedium?: string;
  imgLarge?: string;
  imgPreferred?: string;

  /* collection meta */
  collectionImage: string;
  collectionShortName: string;
  collectionCategory: string;

  usdValue?: number;
};

/* ────────────── union used by creator-api ─── */
export type StoredDonationData = TokenDonationData | NftDonationData;
