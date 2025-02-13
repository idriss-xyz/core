import { useQuery } from '@tanstack/react-query';

import { Hex } from '@/app/creators/donate/types';
import { TipHistoryResponse } from '@/app/creators/tip-history/types';

type Payload = {
  address: Hex;
};

const getTipHistory = async (payload: Payload) => {
  const tipHistory = await fetch('/api/tip-history', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return (await tipHistory.json()) as TipHistoryResponse;
};

export const useGetTipHistory = (payload: Payload) => {
  return useQuery({
    queryKey: ['tipHistory', payload.address],
    queryFn: () => {
      return getTipHistory({ address: payload.address });
    },
  });
};
