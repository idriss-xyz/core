import {
  TipHistoryFromUser,
  TipHistoryNode,
  TipHistoryTokenV2,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';

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
  donateLink: string | undefined;
  donorMetadata: TipHistoryFromUser;
}

export interface DonorHistoryResponse {
  knownDonations: {
    toAddress: Hex;
    fromAddress: Hex;
    timestamp: number;
    transactionHash: Hex;
    data: TipHistoryNode;
  }[];
  stats: DonorHistoryStats;
  leaderboard: DonorLeaderboardStats[];
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
