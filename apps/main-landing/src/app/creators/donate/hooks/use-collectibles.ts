import { CREATOR_API_URL } from '@idriss-xyz/constants';
import { useState, useEffect } from 'react';
import { useWalletClient } from 'wagmi';

import { Collectible } from '../types';

export const useCollectibles = (collections: string[]) => {
  const [data, setData] = useState<Collectible[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: walletClient } = useWalletClient();

  useEffect(() => {
    if (collections.length === 0) {
      setData([]);
      return;
    }

    const fetchCollectibles = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${CREATOR_API_URL}/get-balances/nft/${walletClient?.account.address}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          },
        );
        const collectibles = await response.json();
        setData(collectibles.nftResult.balances);
      } catch (error_) {
        setError('Failed to fetch collectibles');
        console.error('Error fetching collectibles:', error_);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchCollectibles();
  }, [collections, walletClient]);

  return { data, isLoading, error };
};
