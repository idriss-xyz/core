import { ChainToken } from '@idriss-xyz/constants';
import { CSSProperties } from 'react';

export interface NftDetails {
  id: bigint; // tokenId
  name: string; // NFT-specific name
  logo?: string; // image URL from metadata
  collectionName?: string; // contract-level name()
}

export type MinimumAmounts = {
  minimumAlertAmount: number;
  minimumSfxAmount: number;
  minimumTTSAmount: number;
};

export type EnableToggles = {
  alertEnabled: boolean;
  sfxEnabled: boolean;
  ttsEnabled: boolean;
};

export type DonationNotificationProperties = {
  donor: string;
  amount: string;
  message: string;
  sfxText?: string;
  txnHash: string;
  bgColor?: string;
  avatarUrl?: string;
  minimumAmounts: MinimumAmounts;
  enableToggles: EnableToggles;
  customIcon?: string;
  style?: CSSProperties;
  alertSound?: string;
  voiceId?: string;
  creatorName?: string;
  token: {
    amount: bigint;
    details?: ChainToken | NftDetails;
  };
  minOverallVisibleDuration: number; // Minimum total time the notification should be visible
  forceDisplay?: boolean; // use true for test donations
  onFullyComplete: () => void; // Callback when the notification lifecycle is complete
};
