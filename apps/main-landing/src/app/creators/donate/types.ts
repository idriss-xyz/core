import { Hex } from 'viem';

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

export type Collectible = {
  tokenId: string;
  name: string;
  image: string;
  collection: string;
  collectionShortName: string;
  collectionCategory: string;
  collectionImage: string;
  contract: Hex;
  chainId: number;
  balance: string;
  usdValue?: number;
  type: 'erc721' | 'erc1155';
};

// TODO: Check why we have CreatorProfile and CreatorProfileResponse
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
  voiceId?: string;
  alertEnabled?: boolean;
  ttsEnabled?: boolean;
  sfxEnabled?: boolean;
  streamStatus?: string;
  tokenEnabled?: boolean;
  collectibleEnabled?: boolean;
};
