import { useQuery } from '@tanstack/react-query';

import { Hex } from '@/app/creators/donate/types';
import { ClaimedEventsResponse } from '@/app/vault/types';

type Payload = {
  address: Hex;
};

const getBonusStakedBalance = async (payload: Payload) => {
  const claimedEvents = await fetch('/api/claimed-events');

  const claimedEventsData =
    (await claimedEvents.json()) as ClaimedEventsResponse;

  const claimedEvent = claimedEventsData.events.find((event) => {
    return event.to === payload.address && event.bonus;
  });

  return claimedEvent?.total ?? '0';
};

export const useGetBonusStakedBalance = (payload: Payload) => {
  return useQuery({
    queryKey: ['bonusStakedBalance', payload.address],
    queryFn: () => {
      return getBonusStakedBalance({ address: payload.address });
    },
  });
};
