import { useQuery } from '@tanstack/react-query';

import { LeaderboardStats } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../constants';

const getCreatorRanking = async () => {
  const receivedHistory = await fetch(`${CREATOR_API_URL}/creator-leaderboard`);

  const result = await receivedHistory.json();

  return result.leaderboard as LeaderboardStats[];
};

export const useGetCreatorRanking = () => {
  return useQuery({
    queryKey: ['creatorRanking'],
    queryFn: () => {
      return getCreatorRanking();
    },
  });
};
