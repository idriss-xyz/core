import { Hex } from 'viem';

// TODO: check location and use zod
export type CreatorProfileResponse = {
  id: number;
  address: Hex;
  primaryAddress: Hex;
  name: string;
  displayName?: string;
  profilePictureUrl?: string;
  email?: string;
  receiveEmails?: boolean;
  donationUrl: string;
  obsUrl?: string;
  joinedAt: string;
  doneSetup: boolean;
  isDonor: boolean;
  minimumAlertAmount: number;
  minimumTTSAmount: number;
  minimumSfxAmount: number;
  voiceId: string;
  alertEnabled: boolean;
  ttsEnabled: boolean;
  sfxEnabled: boolean;
  tokenEnabled: boolean;
  collectibleEnabled: boolean;
  networks: string[];
  tokens: string[];
  privyId: string;
  customBadWords: string[];
  alertSound: string;
};

export type Goal = {
  id: number;
  name: string;
  targetAmount: number;
  progress: number;
  startDate: string;
  endDate: string;
  topDonor: { name: string; amount: number };
};
