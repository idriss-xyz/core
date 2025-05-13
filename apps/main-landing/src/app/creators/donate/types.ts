import { Hex } from 'viem';

export interface DonationUser {
  address: Hex;
  avatarUrl?: string;
  displayName?: string;
}

export interface LeaderboardStats extends DonationUser {
  totalAmount: number;
  donateLink?: string;
}

export interface DonationToken {
  address: Hex;
  symbol: string;
  network: string;
  decimals: number;
  imageUrl?: string;
}

export interface DonationData {
  toAddress: Hex;
  network: string;
  comment?: string;
  fromAddress: Hex;
  timestamp: number;
  amountRaw: string;
  tokenAddress: Hex;
  tradeValue: number;
  token: DonationToken;
  toUser: DonationUser;
  transactionHash: Hex;
  fromUser: DonationUser;
}

type DonateContentNames =
  | 'user-tip'
  | 'user-history'
  | 'donor-stats'
  | 'donor-history';

interface DonateContentValue {
  name: DonateContentNames;
}

export interface DonateContentValues extends DonateContentValue {
  previous?: DonateContentValue;
}

export type CreatorProfile = {
  name: string | null;
  address: {
    data: Hex | null;
    isValid: boolean;
    isFetching: boolean;
  };
  network: string | null;
  token: string | null;
};
