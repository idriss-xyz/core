import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { getAccessToken } from '@privy-io/react-auth';

import { DonationGoal } from '../../utils/types';

type Options = {
  enabled?: boolean;
};

const getDonationGoals = async (creatorName: string | undefined) => {
  if (!creatorName) {
    throw new Error('Creator name is required to fetch donation goals');
  }
  const authToken = await getAccessToken();
  if (!authToken) {
    throw new Error('Could not get auth token.');
  }
  const response = await fetch(
    `${CREATOR_API_URL}/donation-goal/${creatorName}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch donation goals');
  }

  const goalHistory = await response.json();

  return goalHistory as DonationGoal[];
};

export const useGetDonationGoals = (
  creatorName: string | undefined,
  options?: Options,
) => {
  return useQuery({
    queryKey: ['donation-goals', creatorName],
    queryFn: () => {
      return getDonationGoals(creatorName);
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 5000,
    ...options,
  });
};
