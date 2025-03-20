import { useQuery } from '@tanstack/react-query';

import { DonorHistoryResponse } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../constants';

const getReceivedHistory = async () => {
  const receivedHistory = await fetch(`${CREATOR_API_URL}/streamer-stats`, {
    method: 'POST',
  });

  const result = await receivedHistory.json();

  return result.leaderboard as DonorHistoryResponse['leaderboard'];
};

export const useGetReceivedHistory = () => {
  return useQuery({
    queryKey: ['receivedHistory'],
    queryFn: () => {
      return getReceivedHistory();
    },
  });
};
