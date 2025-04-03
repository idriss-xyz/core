import { useQuery } from '@tanstack/react-query';

import { LeaderboardStats } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../constants';

const getDonorRanking = async () => {
  const response = await fetch(`${CREATOR_API_URL}/donor-leaderboard`);

  const result = await response.json();

  return result.leaderboard as LeaderboardStats[];
};

export const useGetDonorRanking = () => {
  return useQuery({
    queryKey: ['donorRanking'],
    queryFn: () => {
      return getDonorRanking();
    },
  });
};
