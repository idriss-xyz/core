import { TipHistoryFromUser, TipHistoryTokenV2 } from '@idriss-xyz/constants';

export interface DonorHistoryStats {
  totalDonationsCount: number;
  totalDonationAmount: number;
  mostDonatedToAddress: string;
  biggestDonationAmount: number;
  favoriteDonationToken: string;
  donorDisplayName: string | null;
  positionInLeaderboard: number | null;
  favoriteTokenMetadata: Omit<TipHistoryTokenV2, 'onchainMarketData'> | null;
}

export interface DonorLeaderboardStats {
  address: string;
  totalAmount: number;
  donorMetadata: TipHistoryFromUser;
}

export interface DonorHistoryResponse {
  stats: DonorHistoryStats;
  leaderboard: DonorLeaderboardStats[];
}
