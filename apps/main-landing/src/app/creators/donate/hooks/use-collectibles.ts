import { useState, useEffect } from 'react';

interface Collectible {
  id: string;
  name: string;
  image: string;
  collection: string;
  collectionAddress: string;
}

export const useCollectibles = (collections: string[]) => {
  const [data, setData] = useState<Collectible[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (collections.length === 0) {
      setData([]);
      return;
    }

    const fetchCollectibles = () => {
      setIsLoading(true);
      setError(null);

      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`${CREATOR_API_URL}/my-collectibles`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ collections }),
        // });
        // const collectibles = await response.json();
        // setData(collectibles);

        // Dummy data for now
        const dummyCollectibles: Collectible[] = [
          {
            id: '1',
            name: 'Cool NFT #1',
            image: 'https://placehold.co/100',
            collection: 'Cool Collection',
            collectionAddress: '0x8bb4033af06b363a8391f795a39281bcc3b6197d',
          },
          {
            id: '2',
            name: 'Awesome NFT #2',
            image: 'https://placehold.co/100',
            collection: 'Awesome Collection',
            collectionAddress: '0xa7b67cd6b31b73772ae3c8ea784317207194a6f4',
          },
          {
            id: '3',
            name: 'Epic NFT #3',
            image: 'https://placehold.co/100',
            collection: 'Epic Collection',
            collectionAddress: '0xa7b67cd6b31b73772ae3c8ea784317207194a6f4',
          },
          {
            id: '4',
            name: 'Rare NFT #4',
            image: 'https://placehold.co/100',
            collection: 'Rare Collection',
            collectionAddress: '0x8bb4033af06b363a8391f795a39281bcc3b6197d',
          },
          {
            id: '5',
            name: 'Legendary NFT #5',
            image: 'https://placehold.co/100',
            collection: 'Legendary Collection',
            collectionAddress: '0x8bb4033af06b363a8391f795a39281bcc3b6197d',
          },
          {
            id: '6',
            name: 'Mythic NFT #6',
            image: 'https://placehold.co/100',
            collection: 'Mythic Collection',
            collectionAddress: '0xa7b67cd6b31b73772ae3c8ea784317207194a6f4',
          },
        ];

        setData(dummyCollectibles);
      } catch (error_) {
        setError('Failed to fetch collectibles');
        console.error('Error fetching collectibles:', error_);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollectibles();
  }, [collections]);

  return { data, isLoading, error };
};
