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
