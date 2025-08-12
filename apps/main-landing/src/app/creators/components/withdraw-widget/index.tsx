import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  DonationToken,
  Token,
  NULL_ADDRESS,
  TokenBalance,
} from '@idriss-xyz/constants';
import { Hex, isAddress } from 'viem';
import { Divider } from '@idriss-xyz/ui/divider';
import { Icon } from '@idriss-xyz/ui/icon';
import {
  formatFiatValue,
  formatTokenValue,
  getChainById,
  getChainIdByNetworkName,
  getChainLogoById,
  getNetworkKeyByChainId,
} from '@idriss-xyz/utils';

import {
  ChainSelect,
  TokenSelect,
} from '../../donate/components/donate-form/components';
import { TokenLogo } from '../../app/earnings/stats-and-history/token-logo';

import { useWithdrawal } from './use-withdrawal';
import { IdrissSend } from './send';

type WithdrawFormValues = {
  amount: number;
  chainId: number;
  tokenSymbol: string;
  withdrawalAddress: string;
};

type WithdrawWidgetProperties = {
  isOpen: boolean;
  balances: TokenBalance[];
  selectedToken?: string;
  onClose: () => void;
};

export const WithdrawWidget = ({
  isOpen,
  balances,
  selectedToken,
  onClose,
}: WithdrawWidgetProperties) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [showLoader, setShowLoader] = useState(false);
  const loadingStartTimestamp = useRef(0);
  const {
    sendWithdrawal,
    checkGasAndProceed,
    isLoading,
    isSuccess,
    error: formError,
    transactionHash,
    amountInTokens,
    adjustedAmount,
    reset: resetWithdrawal,
  } = useWithdrawal();
  const [visualAmount, setVisualAmount] = useState<string>();
  const [isMaxAmount, setIsMaxAmount] = useState(false);

  const formMethods = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: 0,
      tokenSymbol: selectedToken,
      withdrawalAddress: '',
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    setStep(1);
    formMethods.reset();
    resetWithdrawal();
    setVisualAmount(undefined);
    setIsMaxAmount(false);
  }, [onClose, formMethods, resetWithdrawal]);

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
        // This handles error case, or other cases where we need to hide the loader
        setShowLoader(false);
      }
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [isLoading, isSuccess, showLoader]);

  useEffect(() => {
    if (isOpen) {
      if (selectedToken) {
        formMethods.setValue('tokenSymbol', selectedToken);
      } else if (balances.length > 0) {
        formMethods.setValue('tokenSymbol', balances[0]!.symbol);
      }
    }
  }, [isOpen, selectedToken, formMethods, balances]);

  useEffect(() => {
    if (adjustedAmount) {
      formMethods.setValue('amount', adjustedAmount, {
        shouldValidate: true,
      });
      setVisualAmount(formatFiatValue(adjustedAmount));
    }
  }, [adjustedAmount, formMethods]);

  const formReference = useRef<HTMLFormElement | null>(null);
  const amount = formMethods.watch('amount');
  const chainId = formMethods.watch('chainId');
  const tokenSymbol = formMethods.watch('tokenSymbol');
  const withdrawalAddress = formMethods.watch('withdrawalAddress');

  const selectedBalance = useMemo(() => {
    if (!chainId || !tokenSymbol) return;
    const networkKey = getNetworkKeyByChainId(chainId);
    return balances.find((b) => {
      return b.symbol === tokenSymbol && b.network === networkKey;
    });
  }, [balances, chainId, tokenSymbol]);

  const uniqueOwnedTokens = useMemo(() => {
    if (!balances) return [];
    const seenSymbols = new Set<string>();
    const uniqueTokens: DonationToken[] = [];
    for (const balance of balances) {
      if (!seenSymbols.has(balance.symbol)) {
        seenSymbols.add(balance.symbol);
        uniqueTokens.push({
          name: balance.name,
          imageUrl: balance.imageUrl,
          symbol: balance.symbol,
          network: balance.network,
          decimals: balance.decimals,
          address: balance.address,
        });
      }
    }
    return uniqueTokens;
  }, [balances]);

  const networksForSelectedToken = useMemo(() => {
    if (!tokenSymbol || !balances) return [];
    return balances
      .filter((b) => {
        return b.symbol === tokenSymbol;
      })
      .map((b) => {
        return getChainIdByNetworkName(b.network);
      })
      .filter((id): id is number => {
        return id !== undefined;
      });
  }, [balances, tokenSymbol]);

  const showNetworkSelector = networksForSelectedToken.length > 1;

  useEffect(() => {
    if (networksForSelectedToken.length > 0) {
      const chainId = networksForSelectedToken[0];
      if (chainId !== undefined) {
        formMethods.setValue('chainId', chainId);
      }
    } else {
      formMethods.resetField('chainId');
    }
  }, [networksForSelectedToken, formMethods]);

  const setAmount = useCallback(
    (value: number, isMax: boolean) => {
      return () => {
        formMethods.setValue('amount', value);
        setVisualAmount(formatFiatValue(value));
        setIsMaxAmount(isMax);
      };
    },
    [formMethods],
  );

  const tokenAddress = useMemo(() => {
    if (!chainId || !tokenSymbol) return;
    const networkKey = getNetworkKeyByChainId(chainId);
    const balance = balances.find((b) => {
      return b.symbol === tokenSymbol && b.network === networkKey;
    });
    return balance?.address;
  }, [balances, chainId, tokenSymbol]);

  const totalBalanceOfTokenInUSD = useMemo(() => {
    if (!tokenSymbol || !balances) return 0;
    return balances
      .filter((b) => {
        return b.symbol === tokenSymbol;
      })
      .reduce((sum, b) => {
        return sum + b.usdValue;
      }, 0);
  }, [balances, tokenSymbol]);

  const onSubmit = useCallback(
    async (values: WithdrawFormValues) => {
      if (
        !values.amount ||
        !values.tokenSymbol ||
        !values.chainId ||
        !selectedBalance
      ) {
        return;
      }
      await sendWithdrawal({
        withdrawalAddress: values.withdrawalAddress as Hex,
        chainId: values.chainId,
        isMaxAmount,
        selectedBalance,
        requestedUsdAmount: values.amount,
        tokenAddress,
      });
    },
    [selectedBalance, tokenAddress, isMaxAmount, sendWithdrawal],
  );

  const onNextStep = useCallback(async () => {
    const values = formMethods.getValues();
    const { amount: requestedUsdAmount, chainId } = values;

    if (!selectedBalance) return;

    const canProceed = await checkGasAndProceed({
      chainId,
      isMaxAmount,
      selectedBalance,
      requestedUsdAmount,
      tokenAddress,
    });
    if (canProceed) {
      setStep(2);
    }
  }, [
    formMethods,
    tokenAddress,
    isMaxAmount,
    selectedBalance,
    checkGasAndProceed,
  ]);

  return (
    <IdrissSend.Container
      isOpened={isOpen}
      onClose={handleClose}
      header={
        !isLoading &&
        !isSuccess && <IdrissSend.Heading>Withdraw</IdrissSend.Heading>
      }
    >
      {() => {
        if (showLoader) {
          return (
            <IdrissSend.Loading
              className="px-5 pb-9 pt-5"
              heading={
                <>
                  Sending{' '}
                  <span className="text-mint-600">
                    {formatFiatValue(amount)}
                  </span>{' '}
                  (
                  {amountInTokens && selectedBalance
                    ? formatTokenValue(
                        Number(amountInTokens) / 10 ** selectedBalance.decimals,
                      )
                    : '0'}{' '}
                  {tokenSymbol})
                </>
              }
              recipient={withdrawalAddress}
            />
          );
        }

        if (isSuccess) {
          return (
            <IdrissSend.Success
              heading="Withdrawal completed"
              className="p-5"
              onConfirm={handleClose}
              chainId={chainId}
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
                  <Controller
                    control={formMethods.control}
                    name="tokenSymbol"
                    render={({ field }) => {
                      return (
                        <TokenSelect
                          className="mt-2"
                          label="Token"
                          tokens={uniqueOwnedTokens.map(
                            ({ symbol, name, imageUrl }): Token => {
                              return {
                                symbol,
                                name: name!,
                                logo: imageUrl!,
                              };
                            },
                          )}
                          onChange={(value) => {
                            field.onChange(value);
                            formMethods.resetField('amount');
                            setVisualAmount(undefined);
                            setIsMaxAmount(false);
                          }}
                          value={field.value}
                        />
                      );
                    }}
                  />

                  {showNetworkSelector && (
                    <Controller
                      control={formMethods.control}
                      name="chainId"
                      render={({ field }) => {
                        return (
                          <ChainSelect
                            className="mt-4"
                            label="Network"
                            allowedChainsIds={networksForSelectedToken}
                            onChange={(value) => {
                              field.onChange(value);
                              formMethods.resetField('amount');
                              setVisualAmount(undefined);
                              setIsMaxAmount(false);
                            }}
                            value={field.value}
                          />
                        );
                      }}
                    />
                  )}

                  <Controller
                    control={formMethods.control}
                    name="amount"
                    rules={{
                      validate: (value) => {
                        if (value <= 0) {
                          return 'Amount must be greater than zero.';
                        }
                        if (value > totalBalanceOfTokenInUSD) {
                          return `Not enough ${tokenSymbol} in your wallet. Add funds to continue.`;
                        }
                        return true;
                      },
                    }}
                    render={({ field, fieldState: { error } }) => {
                      return (
                        <DesignSystemForm.Field
                          {...field}
                          className="mt-4"
                          value={visualAmount ?? field.value.toString()}
                          onChange={(value) => {
                            setVisualAmount(undefined);
                            setIsMaxAmount(false);
                            return field.onChange(Number(value));
                          }}
                          label="Amount"
                          numeric
                          prefixElement={<span>$</span>}
                          error={!!error}
                          helperText={error?.message}
                        />
                      );
                    }}
                  />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {selectedBalance &&
                      selectedBalance.usdValue > 0 &&
                      [25, 50, 100].map((percentage) => {
                        const balanceFloat = Number.parseFloat(
                          selectedBalance.balance,
                        );
                        const price = selectedBalance.usdValue / balanceFloat;
                        const amountInUSD =
                          balanceFloat * (percentage / 100) * price;

                        const isSelected =
                          Math.abs(amount - amountInUSD) < 0.01;

                        return (
                          <Button
                            key={percentage}
                            className={classes(
                              'w-full',
                              isSelected &&
                                'border-mint-600 bg-mint-300 hover:border-mint-600 hover:bg-mint-300',
                            )}
                            intent="secondary"
                            size="medium"
                            onClick={setAmount(amountInUSD, percentage === 100)}
                          >
                            {percentage}%
                          </Button>
                        );
                      })}
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-[10px] px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-label4">Selected asset</span>
                      <div className="flex flex-row items-center gap-[10px] text-label4">
                        <div className="h-6">
                          <TokenLogo symbol={tokenSymbol} />
                        </div>
                        <span className="text-body4 text-neutralGreen-900">
                          {tokenSymbol}
                        </span>
                        <span className="hidden">{tokenAddress}</span>{' '}
                        <span className="rounded-[4px] bg-mint-200 px-1 text-label6 text-mint-700">
                          {formatFiatValue(amount)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-label4 text-neutralGreen-900">
                        Selected network
                      </span>
                      <div className="flex flex-row gap-[10px] text-label4">
                        <img
                          src={getChainLogoById(chainId)}
                          className="size-6 rounded-full"
                          alt=""
                        />{' '}
                        <span className="text-body4">
                          {getChainById(chainId)?.name}
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
                >
                  {step === 1 ? 'Continue' : 'Send'}
                </Button>
                {formError && (
                  <div className="mt-1 flex items-start gap-x-1 text-label7 text-red-500 lg:text-label6">
                    <Icon name="AlertCircle" size={16} className="p-px" />
                    <span>{formError}</span>
                  </div>
                )}
              </div>
            </DesignSystemForm>
          </>
        );
      }}
    </IdrissSend.Container>
  );
};

WithdrawWidget.displayName = 'WithdrawWidget';
