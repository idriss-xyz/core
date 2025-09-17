import { useQuery } from '@tanstack/react-query';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { DonorHistoryResponse } from '../types';
type Options = {
  enabled?: boolean;
};

type Payload = {
  name: string;
};

const getDonorHistory = async (payload: Payload) => {
  const response = await fetch(
    `${CREATOR_API_URL}/donor-history?name=${encodeURIComponent(payload.name)}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch donor history');
  }

  const donorHistory = await response.json();

  return donorHistory as DonorHistoryResponse;
};

export const useGetDonorHistory = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['donorHistory', payload.name],
    queryFn: () => {
      return getDonorHistory({ name: payload.name });
    },
    ...options,
  });
};
