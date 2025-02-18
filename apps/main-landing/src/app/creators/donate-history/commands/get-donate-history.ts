import { useQuery } from '@tanstack/react-query';

import { Hex } from '@/app/creators/donate/types';

import { TipHistoryResponse } from '../types';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getDonateHistory = async (payload: Payload) => {
  const tipHistory = await fetch('/api/tip-history', {
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
