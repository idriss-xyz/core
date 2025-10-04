import { useState, useEffect, useMemo } from 'react';
import { Checkbox } from '@idriss-xyz/ui/checkbox';
import { Card } from '@idriss-xyz/ui/card';
import { IconButton } from '@idriss-xyz/ui/icon-button';
import { NumericButtonGroup } from '@idriss-xyz/ui/numeric-button-group';
import { CHAIN_ID_TO_NFT_COLLECTIONS, NftBalance } from '@idriss-xyz/constants';
import { getAddress } from 'viem';
import { useWalletClient } from 'wagmi';
import { classes } from '@idriss-xyz/ui/utils';
import { Button } from '@idriss-xyz/ui/button';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';
import { Link } from '@idriss-xyz/ui/link';

import { useCollectibles } from '../../../hooks/use-collectibles';

import { LayersBadge } from './layer-badge';

interface Properties {
  searchQuery: string;
  showMobileFilter: boolean;
  setShowMobileFilter: (show: boolean) => void;
  onSelect: (collectible: NftBalance & { amount: number }) => void;
  onConfirm: () => void;
  initialSelectedCollections?: string[];
  onSelectedCollectionsChange?: (c: string[]) => void;
}

const getCollectibleKey = (collectible: NftBalance) => {
  return `${collectible.contract}-${collectible.tokenId}`;
};

export const CollectibleGallery = ({
  searchQuery,
  showMobileFilter,
  setShowMobileFilter,
  onSelect,
  onConfirm,
  initialSelectedCollections,
  onSelectedCollectionsChange,
}: Properties) => {
  const { data: walletClient } = useWalletClient();
  const { data: collectibles, isLoading } = useCollectibles(
    walletClient?.account?.address,
  );

  type Collection = {
    chainId: number;
    address: string;
    name: string;
    shortName: string;
    category: string;
    image: string;
  };

  const uniqueCollections = useMemo(() => {
    if (!collectibles) return [];

    const seen = new Set<string>();
    const result: Collection[] = [];

    for (const c of collectibles) {
      const address = getAddress(c.contract);
      const key = `${c.chainId}-${address}`;
      if (seen.has(key)) continue;

      seen.add(key);

      const known = CHAIN_ID_TO_NFT_COLLECTIONS[c.chainId]?.find((col) => {
        return getAddress(col.address) === address;
      });

      result.push({
        chainId: c.chainId,
        address,
        name: known?.name ?? `${address.slice(0, 6)}…${address.slice(-4)}`, // fallback label
        shortName: c.collectionShortName,
        category: c.collectionCategory,
        image: c.collectionImage,
      });
    }

    return result.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }, [collectibles]);

  const groupedCollections = useMemo(() => {
    const groups: Record<string, Collection[]> = {};
    for (const col of uniqueCollections ?? []) {
      (groups[col.category] ||= []).push(col);
    }
    return groups;
  }, [uniqueCollections]);

  const [_selectedCollections, _setSelectedCollections] = useState<string[]>(
    initialSelectedCollections ?? [],
  );
  const [hasInitialized, setHasInitialized] = useState(false);

  const setSelectedCollections = (next: string[], propagate = true) => {
    _setSelectedCollections(next);
    if (propagate) onSelectedCollectionsChange?.(next);
  };
  const [selectedCollectibleId, setSelectedCollectibleId] = useState<
    string | null
  >(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  useEffect(() => {
    if (!collectibles?.length || hasInitialized) return;

    const allContracts = uniqueCollections.map((col) => {
      return `${col.chainId}-${col.address}`;
    });

    const startSelection = initialSelectedCollections?.length
      ? initialSelectedCollections.filter((c) => {
          return allContracts.includes(c);
        })
      : allContracts;

    setSelectedCollections(startSelection, false);
    setHasInitialized(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectibles, uniqueCollections, initialSelectedCollections]);

  // Toggle handler now uses composite key and the new setter (replace body)
  const handleCollectionToggle = (key: string) => {
    const updated = _selectedCollections.includes(key)
      ? _selectedCollections.filter((k) => {
          return k !== key;
        })
      : [..._selectedCollections, key];

    setSelectedCollections(updated); // ← now matches the expected type
  };

  const handleCollectibleClick = (collectible: NftBalance) => {
    const collectibleKey = getCollectibleKey(collectible);

    if (
      collectible.type === 'erc721' ||
      (collectible.type === 'erc1155' && Number(collectible.balance) === 1)
    ) {
      if (selectedAmount === 1 && selectedCollectibleId === collectibleKey) {
        setSelectedAmount(0);
        setSelectedCollectibleId(null);
      } else {
        setSelectedCollectibleId(collectibleKey);
        setSelectedAmount(1);
        onSelect({ ...collectible, amount: 1 });
      }
    } else if (
      collectible.type === 'erc1155' &&
      Number(collectible.balance) > 1
    ) {
      // For ERC1155 with multiple tokens, always set to 1 when clicked
      setSelectedCollectibleId(collectibleKey);
      setSelectedAmount(1);
      onSelect({ ...collectible, amount: 1 });
    }
  };

  const handleAmountChange = (collectible: NftBalance, newAmount: number) => {
    setSelectedAmount(newAmount);

    if (newAmount === 0) {
      // Remove selection when amount goes to 0
      setSelectedCollectibleId(null);
      onSelect({ ...collectible, amount: 0 });
    } else {
      onSelect({ ...collectible, amount: newAmount });
    }
  };

  const filteredCollectibles =
    collectibles?.filter((collectible) => {
      const matchesSearch = collectible.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCollection = _selectedCollections.includes(
        `${collectible.chainId}-${getAddress(collectible.contract)}`,
      );
      return matchesSearch && matchesCollection;
    }) ?? [];

  const handleSelectAllCollections = () => {
    if (_selectedCollections.length > 0) {
      setSelectedCollections([]);
    } else {
      setSelectedCollections(
        uniqueCollections.map((c) => {
          return `${c.chainId}-${c.address}`;
        }),
      );
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">Loading collectibles...</div>;
  }

  return (
    <div>
      <div className="flex gap-6">
        {/* Desktop Collection Filter - hidden below md */}
        <ScrollArea className="hidden max-h-96 overflow-y-auto md:block">
          <div className="w-48 shrink-0">
            <h3 className="mb-3 text-label3 text-neutralGreen-900">
              Collections
            </h3>
            <div className="mb-4">
              <Link
                size="m"
                onClick={handleSelectAllCollections}
                className="my-3 cursor-pointer lg:text-label7"
              >
                {_selectedCollections.length > 0
                  ? 'Unselect all'
                  : 'Select all'}
              </Link>
            </div>
            <div className="space-y-2">
              {Object.entries(groupedCollections).map(([category, cols]) => {
                return (
                  <div key={category} className="mb-4">
                    <h3 className="mb-3 text-body6 text-neutral-600">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {cols.map((collection) => {
                        const collectionKey = `${collection.chainId}-${collection.address}`;
                        return (
                          <label
                            key={collectionKey}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Checkbox
                              value={_selectedCollections.includes(
                                collectionKey,
                              )}
                              onChange={() => {
                                return handleCollectionToggle(collectionKey);
                              }}
                            />
                            <img
                              src={collection.image}
                              className="size-6 rounded"
                              alt=""
                            />
                            <span className="text-sm text-neutral-700">
                              {collection.shortName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>

        {/* Gallery */}
        <div className="min-h-[300px] flex-1">
          {filteredCollectibles.length === 0 ? (
            <div className="py-8 text-center text-neutral-500">
              No collectibles found
            </div>
          ) : (
            <ScrollArea className="max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 pr-5 md:grid-cols-3">
                {filteredCollectibles.map((collectible) => {
                  const collectibleKey = getCollectibleKey(collectible);
                  const isSelected = selectedCollectibleId === collectibleKey;

                  return (
                    <div
                      key={collectibleKey}
                      className={classes(
                        'relative flex cursor-pointer flex-col gap-[10px] rounded-xl border border-neutral-300 p-[6px] transition-colors hover:border-mint-500',
                        isSelected ? 'border-mint-500' : '',
                      )}
                      onClick={() => {
                        return handleCollectibleClick(collectible);
                      }}
                    >
                      <img
                        src={collectible.imgPreferred ?? collectible.imgMedium}
                        alt={collectible.name}
                        className="h-[240px] w-auto rounded-xl object-cover"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 flex-col">
                          <p className="truncate text-sm font-medium">
                            {collectible.name}
                          </p>
                          <p className="truncate text-xs text-neutral-500">
                            {collectible.collection}
                          </p>
                        </div>
                        {collectible.type === 'erc1155' &&
                          Number(collectible.balance) > 1 && (
                            <LayersBadge amount={collectible.balance} />
                          )}
                      </div>

                      {/* Selection controls */}
                      <div className="absolute right-3 top-3">
                        {(() => {
                          if (
                            collectible.type === 'erc721' ||
                            (collectible.type === 'erc1155' &&
                              Number(collectible.balance) === 1)
                          ) {
                            return (
                              <IconButton
                                iconName={isSelected ? 'Check' : 'Plus'}
                                intent="tertiary"
                                size="small"
                                className={`shadow-[0_0_0_4px_rgba(242,242,242,0.14)] ${isSelected ? 'bg-mint-500 text-white' : 'bg-white'}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCollectibleClick(collectible);
                                }}
                              />
                            );
                          } else {
                            // ERC1155 with multiple tokens
                            return isSelected ? (
                              <div
                                onClick={(event) => {
                                  return event.stopPropagation();
                                }}
                              >
                                <NumericButtonGroup
                                  value={selectedAmount}
                                  onChange={(newAmount) => {
                                    return handleAmountChange(
                                      collectible,
                                      newAmount,
                                    );
                                  }}
                                  min={0}
                                  max={Number(collectible.balance)}
                                  className="bg-white shadow-[0_0_0_4px_rgba(242,242,242,0.14)]"
                                />
                              </div>
                            ) : (
                              <IconButton
                                iconName="Plus"
                                intent="tertiary"
                                size="small"
                                className="bg-white shadow-[0_0_0_4px_rgba(242,242,242,0.14)]"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleCollectibleClick(collectible);
                                }}
                              />
                            );
                          }
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
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
            <div className="mb-4">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  value={_selectedCollections.length === 0}
                  onChange={() => {
                    return setSelectedCollections([]);
                  }}
                />
                <span className="text-sm text-neutral-700">Unselect all</span>
              </label>
            </div>
            <ScrollArea className="max-h-72 w-full space-y-2 overflow-y-auto">
              {Object.entries(groupedCollections).map(([category, cols]) => {
                return (
                  <div key={category} className="mb-4">
                    <h3 className="mb-3 text-body6 text-neutral-600">
                      {category}
                    </h3>
                    <div className="space-y-2">
                      {cols.map((collection) => {
                        const collectionKey = `${collection.chainId}-${collection.address}`;
                        return (
                          <label
                            key={collectionKey}
                            className="flex cursor-pointer items-center gap-2"
                          >
                            <Checkbox
                              value={_selectedCollections.includes(
                                collectionKey,
                              )}
                              onChange={() => {
                                return handleCollectionToggle(collectionKey);
                              }}
                            />
                            <img
                              src={collection.image}
                              className="size-6 rounded"
                              alt=""
                            />
                            <span className="text-sm text-neutral-700">
                              {collection.shortName}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </ScrollArea>
          </Card>
        </div>
      )}
      {selectedCollectibleId && (
        <div className="fixed bottom-0 right-0 z-10 flex w-full items-center justify-end rounded-b-xl border-t border-neutral-300 bg-white px-12 py-3">
          <Button
            size="medium"
            intent="primary"
            onClick={onConfirm}
            className="uppercase"
            suffixIconName="ChevronRight"
          >
            Confirm
          </Button>
        </div>
      )}
    </div>
  );
};
