import { Hex } from 'viem';

interface DonorHistoryStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  mostDonatedToAddress: Hex;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
  favoriteTokenMetadata: {
    symbol: string;
    imageUrl?: string;
    address: Hex;
    decimals: number;
  } | null;
}

interface DonorLeaderboardStats {
  address: Hex;
  totalAmount: number;
  donateLink?: string;
  donorMetadata: DonationUser;
}

type DonateContentNames =
  | 'user-tip'
  | 'user-history'
  | 'donor-stats'
  | 'donor-history';

interface DonateContentValue {
  name: DonateContentNames;
}

interface DonationToken {
  address: Hex;
  symbol: string;
  imageUrl?: string;
  network: string;
  decimals: number;
}

export interface DonorHistoryResponse {
  donations: DonationData[];
  stats: DonorHistoryStats;
  leaderboard: DonorLeaderboardStats[];
}

export interface DonateContentValues extends DonateContentValue {
  previous?: DonateContentValue;
}

export interface DonationUser {
  address: Hex;
  displayName?: string;
  displayNameSource?: string;
  avatarUrl?: string;
  avatarSource?: string;
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
