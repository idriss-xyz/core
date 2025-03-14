import { useQuery } from '@tanstack/react-query';
import { TipHistoryResponse } from '@idriss-xyz/constants';

import { CREATOR_API_URL } from '../constants';

const getReceivedHistory = async () => {
  // const receivedHistory = await fetch(`${CREATOR_API_URL}/received-history`, {
  // TODO: change url to new endpoint
  const receivedHistory = await fetch(`${CREATOR_API_URL}/tip-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // TODO: update body to match new endpoint payload
    body: JSON.stringify({
      address: '0x42d4cb836571e60ffc84a6cdbeaa2f0d2240c2bd',
    }),
  });

  const result = await receivedHistory.json();

  return result as TipHistoryResponse;
};

export const useGetReceivedHistory = () => {
  return useQuery({
    queryKey: ['receivedHistory'],
    queryFn: () => {
      return getReceivedHistory();
    },
  });
};
