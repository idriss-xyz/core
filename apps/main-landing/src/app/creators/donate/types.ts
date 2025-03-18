import { TipHistoryFromUser, TipHistoryTokenV2 } from '@idriss-xyz/constants';

interface DonorHistoryStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  mostDonatedToAddress: string;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
  favoriteTokenMetadata: Omit<TipHistoryTokenV2, 'onchainMarketData'> | null;
}

interface DonorLeaderboardStats {
  address: string;
  totalAmount: number;
  donorMetadata: TipHistoryFromUser;
}

export interface DonorHistoryResponse {
  stats: DonorHistoryStats;
  leaderboard: DonorLeaderboardStats[];
}

export type donateContentValues = {
  userDetails?: TipHistoryFromUser;
  name: 'tip' | 'history' | 'userHistory';
  backTo?: 'tip' | 'history' | 'userHistory';
};
