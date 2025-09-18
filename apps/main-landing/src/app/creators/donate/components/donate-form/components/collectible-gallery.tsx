import { useState } from 'react';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Card } from '@idriss-xyz/ui/card';
import { IconButton } from '@idriss-xyz/ui/icon-button';

import { Collectible } from '../../../types';
import { useCollectibles } from '../../../hooks/use-collectibles';
import { CHAIN_ID_TO_NFT_COLLECTIONS, CREATOR_CHAIN } from '@idriss-xyz/constants';
import { getAddress } from 'viem';

interface Properties {
  collections: string[];
  searchQuery: string;
  showMobileFilter: boolean;
  setShowMobileFilter: (show: boolean) => void;
  onSelect: (collectible: Collectible) => void;
}

export const CollectibleGallery = ({
  collections,
  searchQuery,
  showMobileFilter,
  setShowMobileFilter,
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
        collectible.contract,
      );
      return matchesSearch && matchesCollection;
    }) ?? [];

  if (isLoading) {
    return <div className="py-8 text-center">Loading collectibles...</div>;
  }

  return (
    <div>
      <div className="flex gap-6">
        {/* Desktop Collection Filter - hidden below md */}
        <div className="hidden w-48 shrink-0 md:block">
          <h3 className="mb-3 text-sm font-medium text-neutral-900">
            Collections
          </h3>
          <div className="space-y-2">
            {CHAIN_ID_TO_NFT_COLLECTIONS[CREATOR_CHAIN.BASE.id].map((collection) => {
              const collectionChecksumAddress = getAddress(collection.address);
              return (
                <label
                  key={collectionChecksumAddress}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    value={selectedCollections.includes(collectionChecksumAddress)}
                    onChange={() => {
                      return handleCollectionToggle(collectionChecksumAddress);
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
            <div className="grid max-h-96 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
              {filteredCollectibles.map((collectible) => {
                return (
                  <div
                    key={collectible.tokenId}
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

      {/* Mobile Filter Card - floating from bottom */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 mt-0 md:hidden">
          <div
            className="absolute inset-0 rounded-xl bg-black/50"
            onClick={() => {
              return setShowMobileFilter(false);
            }}
          />
          <Card className="absolute inset-x-0 bottom-0 rounded-b-xl rounded-t-lg p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-neutral-900">
                Collections
              </h3>
              <IconButton
                iconName="X"
                intent="tertiary"
                size="small"
                onClick={() => {
                  return setShowMobileFilter(false);
                }}
              />
            </div>
            <div className="space-y-2">
              {CHAIN_ID_TO_NFT_COLLECTIONS[CREATOR_CHAIN.BASE.id].map((collection) => {
                const collectionChecksumAddress = getAddress(collection.address);
                return (
                  <label
                    key={collectionChecksumAddress}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      value={selectedCollections.includes(collectionChecksumAddress)}
                      onChange={() => {
                        return handleCollectionToggle(collectionChecksumAddress);
                      }}
                    />
                    <span className="text-sm text-neutral-700">
                      {collection.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
