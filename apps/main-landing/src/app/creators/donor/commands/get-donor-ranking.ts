import { useQuery } from '@tanstack/react-query';

import { LeaderboardStats } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../../donate/constants';

const getDonorRanking = async () => {
  const donorRanking = await fetch(`${CREATOR_API_URL}/donor-leaderboard`);

  if (!donorRanking.ok) {
    throw new Error('Failed to fetch donor ranking');
  }

  const ranking = await donorRanking.json();

  return ranking.leaderboard as LeaderboardStats[];
};

export const useGetDonorRanking = () => {
  return useQuery({
    queryKey: ['donorRanking'],
    queryFn: () => {
      return getDonorRanking();
    },
  });
};
