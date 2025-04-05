import { useQuery } from '@tanstack/react-query';

import { LeaderboardStats } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../../donate/constants';

const getCreatorRanking = async () => {
  const creatorRanking = await fetch(`${CREATOR_API_URL}/creator-leaderboard`);

  if (!creatorRanking.ok) {
    throw new Error('Failed to fetch creator ranking');
  }

  const ranking = await creatorRanking.json();

  return ranking.leaderboard as LeaderboardStats[];
};

export const useGetCreatorRanking = () => {
  return useQuery({
    queryKey: ['creatorRanking'],
    queryFn: () => {
      return getCreatorRanking();
    },
  });
};
