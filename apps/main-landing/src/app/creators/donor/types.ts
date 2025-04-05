import { Hex } from 'viem';

import {
  DonationData,
  DonationToken,
  DonationUser,
} from '@/app/creators/donate/types';

export interface DonorHistoryStats {
  mostDonatedToAddress: Hex;
  totalDonationsCount: number;
  totalDonationAmount: number;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  mostDonatedToUser: DonationUser;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
  favoriteTokenMetadata: DonationToken | null;
}

export interface DonorHistoryResponse {
  stats: DonorHistoryStats;
  donations: DonationData[];
}
