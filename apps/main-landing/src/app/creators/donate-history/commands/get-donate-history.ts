import { useQuery } from '@tanstack/react-query';

import { Hex } from '@/app/creators/donate/types';

import { TipHistoryResponse } from '../types';
import { CREATOR_API_URL } from '../../donate/constants';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getDonateHistory = async (payload: Payload) => {
  const tipHistory = await fetch(`${CREATOR_API_URL}/tip-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return (await tipHistory.json()) as TipHistoryResponse;
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
