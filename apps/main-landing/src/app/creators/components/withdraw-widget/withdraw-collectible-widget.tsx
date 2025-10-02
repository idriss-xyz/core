import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  NftBalance,
  CollectionOption,
  NftOption,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';
import { Divider } from '@idriss-xyz/ui/divider';
import { Icon } from '@idriss-xyz/ui/icon';
import { getChainById, getChainLogoById } from '@idriss-xyz/utils';

import {
  CollectionSelect,
  ItemSelect,
  LayersBadge,
} from '../../donate/components/donate-form/components';

import { useNftWithdrawal } from './hooks/use-nft-withdrawal';
import { IdrissWithdraw } from './widget';

type WithdrawFormValues = {
  amount1155?: string;
  withdrawalAddress: string;
};

type Properties = {
  isOpen: boolean;
  nftBalances: NftBalance[];
  selectedNft?: { contract: Hex; tokenId: string; chainId: number };
  onClose: () => void;
};

export const WithdrawCollectibleWidget = ({
  isOpen,
  nftBalances,
  selectedNft,
  onClose,
}: Properties) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showLoader, setShowLoader] = useState(false);
  const [gasLoading, setGasLoading] = useState(false);
  const loadingStartTimestamp = useRef(0);
  const {
    sendNftWithdrawal: sendWithdrawal,
    checkGasAndProceedNft: checkGasAndProceed,
    isLoading,
    isSuccess,
    error: formError,
    transactionHash,
    reset: resetWithdrawal,
  } = useNftWithdrawal();
  const formMethods = useForm<WithdrawFormValues>({
    defaultValues: { amount1155: '1', withdrawalAddress: '' },
    mode: 'onChange',
  });

  // Build collections from nftBalances (identical to token widget uniqueOwnedTokens)
  const collections = useMemo<CollectionOption[]>(() => {
    const map = new Map<string, CollectionOption>();
    for (const b of nftBalances) {
      if (!b.collection) continue;
      const key = `${b.contract}_${b.chainId}`;
      if (!map.has(key)) {
        map.set(key, {
          address: b.contract,
          chainId: b.chainId,
          name: b.collection,
          image: b.collectionImage ?? '',
          usdValue: 0,
          itemsCount: 0,
        });
      }
      const entry = map.get(key)!;
      entry.usdValue += b.usdValue ?? 0;
      entry.itemsCount += Number(b.balance ?? '1');
    }
    return [...map.values()];
  }, [nftBalances]);

  const [selectedCollection, setSelectedCollection] =
    useState<CollectionOption>();
  const itemsOfCollection = useMemo<NftOption[]>(() => {
    if (!selectedCollection) return [];
    return nftBalances
      .filter((b) => {
        return (
          b.contract === selectedCollection.address &&
          b.chainId === selectedCollection.chainId
        );
      })
      .map<NftOption>((b) => {
        return {
          tokenId: b.tokenId,
          name: b.name ?? `NFT #${b.tokenId}`,
          image: b.imgSmall ?? '',
          balance: b.balance,
          type: b.type,
        };
      });
  }, [nftBalances, selectedCollection]);
  const [selectedItem, setSelectedItem] = useState<NftOption>();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isLoading) {
      setShowLoader(true);
      loadingStartTimestamp.current = Date.now();
    }

    if (!isLoading && showLoader) {
      if (isSuccess) {
        const loadingDuration = Date.now() - loadingStartTimestamp.current;
        const minLoadingTime = 2000;
        const remainingTime = Math.max(0, minLoadingTime - loadingDuration);

        timer = setTimeout(() => {
          return setShowLoader(false);
        }, remainingTime);
      } else {
        setShowLoader(false);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading, isSuccess, showLoader]);

  // Preselect collection/item on modal open, with optional selectedNft (identical to token widget)
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      formMethods.reset();
      resetWithdrawal();
      if (selectedNft) {
        const col = collections.find((c) => {
          return (
            c.address === selectedNft.contract &&
            c.chainId === selectedNft.chainId
          );
        });
        setSelectedCollection(col);
        const itm = nftBalances.find((b) => {
          return (
            b.contract === selectedNft.contract &&
            b.tokenId === selectedNft.tokenId
          );
        });
        setSelectedItem(
          itm
            ? {
                tokenId: itm.tokenId,
                name: itm.name ?? `NFT #${itm.tokenId}`,
                image: itm.imgMedium ?? itm.imgSmall ?? '',
                balance: itm.balance,
                type: itm.type,
              }
            : undefined,
        );
      } else {
        setSelectedCollection(undefined);
        setSelectedItem(undefined);
      }
    }
  }, [
    isOpen,
    formMethods,
    resetWithdrawal,
    selectedNft,
    collections,
    nftBalances,
  ]);

  // Auto-select first collection if none selected (identical to token widget)
  useEffect(() => {
    if (isOpen && collections.length > 0 && !selectedCollection) {
      const first = collections[0]!;
      setSelectedCollection(first);
      // chainId is not part of RHF, so not set here
    }
  }, [isOpen, collections, selectedCollection]);

  // Auto-select first item if none selected (identical to token widget)
  useEffect(() => {
    if (
      isOpen &&
      selectedCollection &&
      itemsOfCollection.length > 0 &&
      !selectedItem
    ) {
      const firstItem = itemsOfCollection[0]!;
      setSelectedItem(firstItem);
      // amount1155 is handled below
    }
  }, [isOpen, selectedCollection, itemsOfCollection, selectedItem]);

  const formReference = useRef<HTMLFormElement | null>(null);
  const values = formMethods.watch();

  const handleClose = useCallback(() => {
    onClose();
    setStep(1);
    formMethods.reset();
    resetWithdrawal();
    setSelectedCollection(undefined);
    setSelectedItem(undefined);
    setGasLoading(false);
  }, [onClose, formMethods, resetWithdrawal]);

  const onNextStep = useCallback(async () => {
    setGasLoading(true);

    if (!selectedCollection || !selectedItem) {
      setGasLoading(false);
      return;
    }

    const canProceed = await checkGasAndProceed({
      chainId: selectedCollection.chainId,
      assetAddress: selectedCollection.address,
      nftType: selectedItem.type,
      tokenId: BigInt(selectedItem.tokenId),
      amount1155:
        selectedItem.type === 'erc1155'
          ? BigInt(formMethods.getValues().amount1155 ?? 1)
          : undefined,
    });

    if (canProceed) setStep(2);
    setGasLoading(false);
  }, [checkGasAndProceed, selectedCollection, selectedItem, formMethods]);

  const onSubmit = useCallback(
    async (values: WithdrawFormValues) => {
      if (!selectedCollection || !selectedItem) return;

      await sendWithdrawal({
        withdrawalAddress: values.withdrawalAddress as Hex,
        chainId: selectedCollection.chainId,
        assetAddress: selectedCollection.address,
        nftType: selectedItem.type,
        tokenId: BigInt(selectedItem.tokenId),
        amount1155:
          selectedItem.type === 'erc1155'
            ? BigInt(values.amount1155 ?? 1)
            : undefined,
      });
    },
    [sendWithdrawal, selectedCollection, selectedItem],
  );

  return (
    <IdrissWithdraw.Container
      isOpened={isOpen}
      onClose={handleClose}
      header={
        !isLoading &&
        !isSuccess && <IdrissWithdraw.Heading>Withdraw</IdrissWithdraw.Heading>
      }
    >
      {() => {
        if (showLoader) {
          return (
            <IdrissWithdraw.Loading
              className="px-5 pb-9 pt-5"
              heading={
                <>
                  Withdrawing{' '}
                  <span className={classes('text-mint-600')}>
                    {selectedItem?.name}
                  </span>{' '}
                  {selectedItem?.type === 'erc1155' &&
                    Number(formMethods.getValues().amount1155 ?? '1') > 1 && (
                      <>({formMethods.getValues().amount1155 ?? '1'}x)</>
                    )}
                </>
              }
              recipient={values.withdrawalAddress}
            />
          );
        }

        if (isSuccess) {
          return (
            <IdrissWithdraw.Success
              heading="Withdrawal completed"
              className="p-5"
              onConfirm={handleClose}
              chainId={selectedCollection!.chainId}
              transactionHash={transactionHash!}
            />
          );
        }

        return (
          <>
            <Divider />
            <DesignSystemForm
              ref={formReference}
              onSubmit={
                step === 1
                  ? formMethods.handleSubmit(onNextStep)
                  : formMethods.handleSubmit(onSubmit)
              }
            >
              {step === 1 ? (
                <div className="p-4">
                  {collections.length > 0 && (
                    <CollectionSelect
                      label="Collection"
                      value={selectedCollection?.address ?? ('' as Hex)}
                      collections={collections}
                      onChange={(value) => {
                        const col = collections.find((c) => {
                          return c.address === value;
                        });
                        setSelectedCollection(col);
                        setSelectedItem(undefined);
                      }}
                      className="mt-2"
                      renderRight={() => {
                        return selectedCollection ? (
                          <div className="flex flex-col items-end rounded-[4px] bg-neutral-200 px-1 py-0.5 leading-none">
                            <div className="flex items-center gap-1">
                              <Icon
                                name="Layers"
                                className="size-4 text-neutral-500"
                              />
                              <span
                                className={classes(
                                  'text-label6 text-neutral-600',
                                )}
                              >
                                {selectedCollection.itemsCount}
                              </span>
                            </div>
                          </div>
                        ) : null;
                      }}
                    />
                  )}

                  {itemsOfCollection.length > 0 && selectedCollection && (
                    <ItemSelect
                      label="Item"
                      value={selectedItem?.tokenId ?? ''}
                      items={itemsOfCollection}
                      onChange={(value) => {
                        const it = itemsOfCollection.find((index) => {
                          return index.tokenId === value;
                        });
                        setSelectedItem(it);
                      }}
                      className="mt-4"
                      renderRight={() => {
                        return selectedItem ? (
                          <div className="flex flex-col items-end rounded-[4px] bg-neutral-200 px-1 py-0.5 leading-none">
                            <div className="flex items-center gap-1">
                              <Icon
                                name="Layers"
                                className="size-4 text-neutral-500"
                              />
                              <span
                                className={classes(
                                  'text-label6 text-neutral-600',
                                )}
                              >
                                {Number(selectedItem.balance)}
                              </span>
                            </div>
                          </div>
                        ) : null;
                      }}
                    />
                  )}

                  {selectedItem?.type === 'erc1155' && (
                    <Controller
                      control={formMethods.control}
                      name="amount1155"
                      rules={{
                        validate: (v) => {
                          const amount = Number(v);
                          if (!v || Number.isNaN(amount) || amount <= 0) {
                            return 'Amount must be greater than zero';
                          }
                          if (amount > Number(selectedItem.balance)) {
                            return `You only have ${selectedItem.balance} available`;
                          }
                          return true;
                        },
                      }}
                      render={({ field, fieldState }) => {
                        return (
                          <DesignSystemForm.Field
                            {...field}
                            numeric
                            className="mt-4"
                            label="Amount"
                            placeholder="1"
                            value={String(field.value ?? '')}
                            onChange={(v) => {
                              const digits = v.replaceAll(/\D/g, '');
                              field.onChange(digits);
                            }}
                            helperText={fieldState.error?.message}
                            error={!!fieldState.error}
                          />
                        );
                      }}
                    />
                  )}
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-[10px] px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={classes('text-label4')}>
                        Selected asset
                      </span>
                      <div
                        className={classes(
                          'flex flex-row items-center gap-[10px] text-label4',
                        )}
                      >
                        <img
                          src={selectedItem!.image}
                          className="size-6 rounded"
                          alt=""
                        />
                        <span
                          className={classes(
                            'text-body4 text-neutralGreen-900',
                          )}
                        >
                          {selectedItem!.name}
                        </span>
                        <span className="hidden">
                          {selectedCollection!.address}
                        </span>{' '}
                        {selectedItem!.type === 'erc1155' &&
                          Number(formMethods.getValues().amount1155 ?? '1') >
                            1 && (
                            <LayersBadge
                              amount={formMethods.getValues().amount1155 ?? '1'}
                            />
                          )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span
                        className={classes('text-label4 text-neutralGreen-900')}
                      >
                        Selected network
                      </span>
                      <div
                        className={classes(
                          'flex flex-row gap-[10px] text-label4',
                        )}
                      >
                        <img
                          src={getChainLogoById(selectedCollection!.chainId)}
                          className="size-6 rounded-full"
                          alt=""
                        />{' '}
                        <span className={classes('text-body4')}>
                          {getChainById(selectedCollection!.chainId)?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Controller
                    control={formMethods.control}
                    name="withdrawalAddress"
                    rules={{
                      validate: (value) => {
                        if (!value) return 'Wallet address is required.';
                        if (
                          !isAddress(value) ||
                          value.toLowerCase() === NULL_ADDRESS.toLowerCase()
                        ) {
                          return 'Enter a valid wallet address.';
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <DesignSystemForm.Field
                          {...field}
                          className="mb-3 px-6"
                          label="Withdrawal address"
                          placeholder="External wallet address"
                          error={!!error}
                          helperText={error?.message}
                        />
                      );
                    }}
                  />
                </>
              )}

              <div className="border-t border-t-neutral-300 px-4 py-3">
                <Button
                  intent="primary"
                  size="medium"
                  type="submit"
                  className="w-full"
                  loading={gasLoading}
                >
                  {step === 1 ? 'Continue' : 'Withdraw'}
                </Button>
                {formError && (
                  <div
                    className={classes(
                      'mt-1 flex items-start gap-x-1 text-label7 text-red-500 lg:text-label6',
                    )}
                  >
                    <Icon name="AlertCircle" size={16} className="p-px" />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </DesignSystemForm>
          </>
        );
      }}
    </IdrissWithdraw.Container>
  );
};

WithdrawCollectibleWidget.displayName = 'WithdrawCollectibleWidget';
