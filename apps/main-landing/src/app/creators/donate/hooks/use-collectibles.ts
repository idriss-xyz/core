import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { Collectible } from '../types';

type Payload = {
  address?: Hex;
  collections: string[];
};

type Options = {
  enabled?: boolean;
};

const getCollectibles = async (payload: Payload): Promise<Collectible[]> => {
  if (!payload.address) {
    throw new Error('Address is required to fetch collectibles');
  }

  if (payload.collections.length === 0) {
    return [];
  }

  const response = await fetch(
    `${CREATOR_API_URL}/get-balances/nft/${payload.address}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (!response.ok) {
    throw new Error('Failed to fetch collectibles');
  }

  const collectibles = await response.json();
  return collectibles.nftResult.balances as Collectible[];
};

export const useCollectibles = (payload: Payload, options?: Options) => {
  return useQuery({
    queryKey: ['collectibles', payload.address, payload.collections],
    queryFn: () => {
      return getCollectibles(payload);
    },
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
