import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { DonorHistoryResponse } from '@/app/creators/donate/types';

import { CREATOR_API_URL } from '../constants';

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
    return null;
  }

  const result = await response.json();

  return result as DonorHistoryResponse;
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
