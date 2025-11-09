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
  goalUrl?: string;
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
  displayTopDonor: boolean;
  networks: string[];
  tokens: string[];
  privyId: string;
  customBadWords: string[];
  alertSound: string;
};

export type DonationGoal = {
  id: number;
  name: string;
  targetAmount: number;
  progress: number;
  startDate: number;
  endDate: number;
  active: boolean;
  deleted: boolean;
  creatorName: string;
  displayTopDonor: boolean;
  topDonor: { name: string; amount: number };
};
