import {
  StoredDonationData,
  DonationToken,
  DonationUser,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';

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
  donations: StoredDonationData[];
}
