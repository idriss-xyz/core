import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useQuery } from '@tanstack/react-query';
import { Hex } from 'viem';

import { Collectible } from '../types';

type Options = {
  enabled?: boolean;
};

const getCollectibles = async (address?: Hex): Promise<Collectible[]> => {
  if (!address) {
    throw new Error('Address is required to fetch collectibles');
  }

  const response = await fetch(
    `${CREATOR_API_URL}/get-balances/nft/${address}`,
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

export const useCollectibles = (address?: Hex, options?: Options) => {
  return useQuery({
    queryKey: ['collectibles', address],
    queryFn: () => {
      return getCollectibles(address);
    },
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
