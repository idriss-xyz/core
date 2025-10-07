import { StoredDonationData, DonorHistoryStats } from '@idriss-xyz/constants';

export interface DonorHistoryResponse {
  stats: DonorHistoryStats;
  donations: StoredDonationData[];
}
