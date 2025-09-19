import { useState } from 'react';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Card } from '@idriss-xyz/ui/card';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NumericButtonGroup } from '@idriss-xyz/ui/numeric-button-group';
import {
  CHAIN_ID_TO_NFT_COLLECTIONS,
  CREATOR_CHAIN,
} from '@idriss-xyz/constants';
import { getAddress } from 'viem';
import { Icon } from '@idriss-xyz/ui/icon';

import { useCollectibles } from '../../../hooks/use-collectibles';
import { Collectible } from '../../../types';
import { useWalletClient } from 'wagmi';

interface Properties {
  collections: string[];
  searchQuery: string;
  showMobileFilter: boolean;
  setShowMobileFilter: (show: boolean) => void;
  onSelect: (collectible: Collectible & { amount: number }) => void;
}

export const LayersBadge = ({ amount }: { amount: string }) => {
  return (
    <div className="flex min-h-4 items-center gap-[6px] rounded-[4px] border border-neutral-300 bg-white p-1">
      <Icon name="Layers" className="text-neutral-500" />
      <span className="text-label6 text-neutralGreen-900">{amount}</span>
    </div>
  );
};

export const CollectibleGallery = ({
  collections,
  searchQuery,
  showMobileFilter,
  setShowMobileFilter,
  onSelect,
}: Properties) => {
  const { data: walletClient } = useWalletClient();
  const { data: collectibles, isLoading, isError } = useCollectibles({
    collections,
    address: walletClient?.account?.address,
  });
  const [selectedCollections, setSelectedCollections] =
    useState<string[]>(collections);
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);

  const handleCollectionToggle = (collectionAddress: string) => {
    setSelectedCollections((previous) => {
      return previous.includes(collectionAddress)
        ? previous.filter((addr) => {
            return addr !== collectionAddress;
          })
        : [...previous, collectionAddress];
    });
  };

  const getCollectibleKey = (collectible: Collectible) => {
    return `${collectible.contract}-${collectible.tokenId}`;
  };

  const handleCollectibleClick = (collectible: Collectible) => {
    const collectibleKey = getCollectibleKey(collectible);

    if (collectible.type === 'erc721') {
      // For ERC721, always amount 1
      setSelectedCollectibleId(collectibleKey);
      setSelectedAmount(1);
      onSelect({ ...collectible, amount: 1 });
    } else {
      // For ERC1155, start with amount 1
      setSelectedCollectibleId(collectibleKey);
      setSelectedAmount(1);
      onSelect({ ...collectible, amount: 1 });
    }
  };

  const handleAmountChange = (collectible: Collectible, newAmount: number) => {
    if (newAmount === 0) {
      // Remove selection
      setSelectedCollectibleId(null);
      setSelectedAmount(1);
    } else {
      setSelectedAmount(newAmount);
      onSelect({ ...collectible, amount: newAmount });
    }
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
            {CHAIN_ID_TO_NFT_COLLECTIONS[CREATOR_CHAIN.BASE.id]?.map(
              (collection) => {
                const collectionChecksumAddress = getAddress(
                  collection.address,
                );
                return (
                  <label
                    key={collectionChecksumAddress}
                    className="flex cursor-pointer items-center gap-2"
                  >
                    <Checkbox
                      value={selectedCollections.includes(
                        collectionChecksumAddress,
                      )}
                      onChange={() => {
                        return handleCollectionToggle(
                          collectionChecksumAddress,
                        );
                      }}
                    />
                    <span className="text-sm text-neutral-700">
                      {collection.name}
                    </span>
                  </label>
                );
              },
            )}
          </div>
        </div>

        {/* Gallery */}
        <div className="min-h-[300px] flex-1">
          {filteredCollectibles.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              No collectibles found
            </div>
          ) : (
            <div className="grid max-h-80 grid-cols-2 gap-4 overflow-y-auto md:grid-cols-3">
              {filteredCollectibles.map((collectible) => {
                return (
                  <div
                    key={collectible.tokenId}
                    className="relative flex cursor-pointer gap-[10px] rounded-xl border border-neutral-200 p-[6px] transition-colors hover:border-mint-500"
                    onClick={() => {
                      return handleCollectibleClick(collectible);
                    }}
                  >
                    <img
                      src={collectible.image}
                      alt={collectible.name}
                      className="size-[48px] rounded-xl object-cover"
                    />
                    <div className="flex">
                      <div className="flex flex-col">
                        <p className="truncate text-sm font-medium">
                          {collectible.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {collectible.collection}
                        </p>
                      </div>
                      {collectible.type === 'erc1155' && (
                        <LayersBadge amount={collectible.balance} />
                      )}
                    </div>

                    {/* Selection controls */}
                    <div className="absolute right-2 top-2">
                      {(() => {
                        const collectibleKey = getCollectibleKey(collectible);
                        const isSelected = selectedCollectibleId === collectibleKey;

                        if (collectible.type === 'erc721') {
                          return (
                            <IconButton
                              iconName={isSelected ? "Check" : "Plus"}
                              intent="tertiary"
                              size="small"
                              className={`${isSelected ? 'bg-mint-500 text-white' : 'bg-white'}`}
                              onClick={(event) => {
                                event.stopPropagation();
                                handleCollectibleClick(collectible);
                              }}
                            />
                          );
                        } else {
                          // ERC1155
                          if (isSelected && selectedAmount > 0) {
                            return (
                              <NumericButtonGroup
                                value={selectedAmount}
                                onChange={(newAmount) => handleAmountChange(collectible, newAmount)}
                                min={0}
                                max={Number(collectible.balance)}
                                className="bg-white"
                                onClick={(event) => event.stopPropagation()}
                              />
                            );
                          } else {
                            return (
                              <IconButton
                                iconName="Plus"
                                intent="tertiary"
                                size="small"
                                className="bg-white"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCollectibleClick(collectible);
                                }}
                              />
                            );
                          }
                        }
                      })()}
                    </div>
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
              {CHAIN_ID_TO_NFT_COLLECTIONS[CREATOR_CHAIN.BASE.id]?.map(
                (collection) => {
                  const collectionChecksumAddress = getAddress(
                    collection.address,
                  );
                  return (
                    <label
                      key={collectionChecksumAddress}
                      className="flex cursor-pointer items-center gap-2"
                    >
                      <Checkbox
                        value={selectedCollections.includes(
                          collectionChecksumAddress,
                        )}
                        onChange={() => {
                          return handleCollectionToggle(
                            collectionChecksumAddress,
                          );
                        }}
                      />
                      <span className="text-sm text-neutral-700">
                        {collection.name}
                      </span>
                    </label>
                  );
                },
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
