import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { getAccessToken } from '@privy-io/react-auth';

import { DonationGoal } from '../../utils/types';

type Options = {
  enabled?: boolean;
};

const getActiveDonationGoal = async (creatorName: string | undefined) => {
  if (!creatorName) {
    throw new Error('Creator name is required to fetch active donation goal');
  }
  const authToken = await getAccessToken();
  if (!authToken) {
    throw new Error('Could not get auth token.');
  }
  const response = await fetch(
    `${CREATOR_API_URL}/donation-goal/${creatorName}/active`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    },
  );

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No active goal found
    }
    throw new Error('Failed to fetch active donation goal');
  }

  const activeGoal = await response.json();
  return activeGoal as DonationGoal;
};

export const useGetActiveDonationGoal = (
  creatorName: string | undefined,
  options?: Options,
) => {
  return useQuery({
    queryKey: ['active-donation-goal', creatorName],
    queryFn: () => {
      return getActiveDonationGoal(creatorName);
    },
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: 5000,
    ...options,
  });
};
