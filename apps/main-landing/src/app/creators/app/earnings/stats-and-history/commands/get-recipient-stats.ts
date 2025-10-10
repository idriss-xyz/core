import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { CREATOR_API_URL, RecipientDonationStats } from '@idriss-xyz/constants';

type Payload = {
  address?: Hex;
};

type Options = {
  enabled?: boolean;
};

const getRecipientStats = async (
  payload: Payload,
): Promise<RecipientDonationStats> => {
  if (!payload.address) {
    throw new Error('Address is required to fetch recipient stats');
  }
  const response = await fetch(`${CREATOR_API_URL}/recipient-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address: payload.address }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch recipient stats');
  }

  const stats = await response.json();

  return stats as RecipientDonationStats;
};

export const useGetRecipientStats = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['recipient-stats', payload.address],
    queryFn: () => {
      return getRecipientStats(payload);
    },
    ...options,
  });
};
