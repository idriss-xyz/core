import { useState } from 'react';
import { Checkbox } from '@idriss-xyz/ui/checkbox';

import { Collectible } from '../../../types';
import { useCollectibles } from '../../../hooks/use-collectibles';

const COLLECTIONS = [
  {
    address: '0xa7b67cd6b31b73772ae3c8ea784317207194a6f4',
    name: 'Parallel Aftermath',
  },
  {
    address: '0x8bb4033af06b363a8391f795a39281bcc3b6197d',
    name: 'Parallel PlanetFall',
  },
];

interface Properties {
  collections: string[];
  searchQuery: string;
  onSelect: (collectible: Collectible) => void;
}

export const CollectibleGallery = ({
  collections,
  searchQuery,
  onSelect,
}: Properties) => {
  const { data: collectibles, isLoading } = useCollectibles(collections);
  const [selectedCollections, setSelectedCollections] =
    useState<string[]>(collections);

  const handleCollectionToggle = (collectionAddress: string) => {
    setSelectedCollections((previous) => {
      return previous.includes(collectionAddress)
        ? previous.filter((addr) => {
            return addr !== collectionAddress;
          })
        : [...previous, collectionAddress];
    });
  };

  const filteredCollectibles =
    collectibles?.filter((collectible) => {
      const matchesSearch = collectible.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCollection = selectedCollections.includes(
        collectible.collectionAddress,
      );
      return matchesSearch && matchesCollection;
    }) ?? [];

  if (isLoading) {
    return <div className="py-8 text-center">Loading collectibles...</div>;
  }

  return (
    <div className="flex gap-6">
      {/* Collection Filter */}
      <div className="w-48 shrink-0">
        <h3 className="mb-3 text-sm font-medium text-neutral-900">
          Collections
        </h3>
        <div className="space-y-2">
          {COLLECTIONS.map((collection) => {
            return (
              <label
                key={collection.address}
                className="flex cursor-pointer items-center gap-2"
              >
                <Checkbox
                  value={selectedCollections.includes(collection.address)}
                  onChange={() => {
                    return handleCollectionToggle(collection.address);
                  }}
                />
                <span className="text-sm text-neutral-700">
                  {collection.name}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Gallery */}
      <div className="flex-1">
        {filteredCollectibles.length === 0 ? (
          <div className="py-8 text-center text-neutral-500">
            No collectibles found
          </div>
        ) : (
          <div className="grid max-h-96 grid-cols-3 gap-4 overflow-y-auto">
            {filteredCollectibles.map((collectible) => {
              return (
                <div
                  key={collectible.id}
                  className="cursor-pointer rounded-lg border border-neutral-200 p-2 transition-colors hover:border-mint-500"
                  onClick={() => {
                    return onSelect(collectible);
                  }}
                >
                  <img
                    src={collectible.image}
                    alt={collectible.name}
                    className="mb-2 aspect-square w-full rounded-md object-cover"
                  />
                  <p className="truncate text-sm font-medium">
                    {collectible.name}
                  </p>
                  <p className="truncate text-xs text-neutral-500">
                    {collectible.collection}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
