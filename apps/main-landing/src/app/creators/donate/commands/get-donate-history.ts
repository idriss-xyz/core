import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { TipHistoryResponse } from '@idriss-xyz/constants';

import { CREATOR_API_URL } from '@idriss-xyz/constants';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getDonateHistory = async (payload: Payload) => {
  const response = await fetch(`${CREATOR_API_URL}/tip-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch donate history');
  }

  const donateHistory = await response.json();

  return donateHistory as TipHistoryResponse;
};

export const useGetTipHistory = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['tipHistory', payload.address],
    queryFn: () => {
      return getDonateHistory({ address: payload.address });
    },
    ...options,
  });
};
