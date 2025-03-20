import { useQuery } from '@tanstack/react-query';

import { DonorHistoryResponse } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../constants';

const getStreamerRanking = async () => {
  const receivedHistory = await fetch(`${CREATOR_API_URL}/streamer-stats`);

  const result = await receivedHistory.json();

  return result.leaderboard as DonorHistoryResponse['leaderboard'];
};

export const useGetStreamerRanking = () => {
  return useQuery({
    queryKey: ['streamerRanking'],
    queryFn: () => {
      return getStreamerRanking();
    },
  });
};
