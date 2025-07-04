import { Hex } from 'viem';

export interface DonationUser {
  address: Hex;
  avatarUrl?: string;
  displayName?: string;
}

export interface LeaderboardStats extends DonationUser {
  totalAmount: number;
  donateLink?: string;
  donorSince?: number;
  donationCount?: number;
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

export type Address = {
  data: Hex | null;
  isValid: boolean;
  isFetching: boolean;
};

export type CreatorProfile = {
  name: string | null;
  address: Address;
  network: string | null;
  token: string | null;
  profilePictureUrl?: string;
  donationUrl?: string;
  obsUrl?: string;
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId?: number;
  alertMuted?: boolean;
  ttsMuted?: boolean;
  sfxMuted?: boolean;
  streamStatus?: string;
};
