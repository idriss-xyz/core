import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL, LeaderboardStats } from '@idriss-xyz/constants';

const getCreatorRanking = async () => {
  const response = await fetch(`${CREATOR_API_URL}/creator-leaderboard`);

  if (!response.ok) {
    throw new Error('Failed to fetch creator ranking');
  }

  const creatorRanking = await response.json();

  return creatorRanking.leaderboard as LeaderboardStats[];
};

export const useGetCreatorRanking = () => {
  return useQuery({
    queryKey: ['creatorRanking'],
    queryFn: () => {
      return getCreatorRanking();
    },
  });
};
