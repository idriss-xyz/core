import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { DonorHistoryResponse } from '../types';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getDonorHistory = async (payload: Payload) => {
  const response = await fetch(`${CREATOR_API_URL}/donor-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch donor history');
  }

  const donorHistory = await response.json();

  return donorHistory as DonorHistoryResponse;
};

export const useGetDonorHistory = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['donorHistory', payload.address],
    queryFn: () => {
      return getDonorHistory({ address: payload.address });
    },
    ...options,
  });
};
