import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { CREATOR_API_URL } from '../../donate/constants';
import { DonorHistoryResponse } from '../types';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getDonorHistory = async (payload: Payload) => {
  const donorHistory = await fetch(`${CREATOR_API_URL}/donor-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!donorHistory.ok) {
    throw new Error('Failed to fetch donor history');
  }

  const history = await donorHistory.json();

  return history as DonorHistoryResponse;
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
