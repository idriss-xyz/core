import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL, LeaderboardStats } from '@idriss-xyz/constants';

const getDonorRanking = async () => {
  const response = await fetch(`${CREATOR_API_URL}/donor-leaderboard`);

  if (!response.ok) {
    throw new Error('Failed to fetch donor ranking');
  }

  const donorRanking = await response.json();

  return donorRanking.leaderboard as LeaderboardStats[];
};

export const useGetDonorRanking = () => {
  return useQuery({
    queryKey: ['donorRanking'],
    queryFn: () => {
      return getDonorRanking();
    },
  });
};
