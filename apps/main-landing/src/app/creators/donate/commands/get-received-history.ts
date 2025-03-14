import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';
import { TipHistoryResponse } from '@idriss-xyz/constants';

import { CREATOR_API_URL } from '../constants';

type Payload = {
  address: Hex;
};

type Options = {
  enabled?: boolean;
};

const getReceivedHistory = async (payload: Payload) => {
  // const receivedHistory = await fetch(`${CREATOR_API_URL}/received-history`, {
  // TODO: change url to new endpoint
  const receivedHistory = await fetch(`${CREATOR_API_URL}/tip-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const result = await receivedHistory.json();

  return result as TipHistoryResponse;
};

export const useGetReceivedHistory = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['receivedHistory', payload.address],
    queryFn: () => {
      return getReceivedHistory({ address: payload.address });
    },
    ...options,
  });
};
