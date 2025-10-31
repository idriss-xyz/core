import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { DonationGoal } from '../../utils/types';

type Options = {
  enabled?: boolean;
};

const getActiveDonationGoal = async (creatorName: string | undefined) => {
  if (!creatorName) {
    throw new Error('Creator name is required to fetch active donation goal');
  }

  const response = await fetch(
    `${CREATOR_API_URL}/donation-goal/${creatorName}/active`,
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
