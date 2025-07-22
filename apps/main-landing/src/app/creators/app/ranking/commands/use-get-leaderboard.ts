import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL, LeaderboardStats } from '@idriss-xyz/constants';

type LeaderboardPeriod = '7d' | '30d' | 'all';

export const periodMap: Record<string, LeaderboardPeriod> = {
  'All time': 'all',
  '30 days': '30d',
  '7 days': '7d',
};
type LeaderboardType = 'creator' | 'donor';

type Payload = {
  period: LeaderboardPeriod;
  type: LeaderboardType;
};

const getLeaderboard = async (
  payload: Payload,
): Promise<LeaderboardStats[]> => {
  const url = new URL(`${CREATOR_API_URL}/${payload.type}-leaderboard`);
  url.searchParams.append('period', payload.period);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch ${payload.type} leaderboard`);
  }

  const data: { leaderboard: LeaderboardStats[] } = await response.json();
  return data.leaderboard;
};

export const useGetLeaderboard = (payload: Payload) => {
  return useQuery({
    queryKey: ['leaderboard', payload.type, payload.period],
    queryFn: () => {
      return getLeaderboard(payload);
    },
  });
};
