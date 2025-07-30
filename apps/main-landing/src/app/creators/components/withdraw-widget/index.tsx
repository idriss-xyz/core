import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  CREATOR_CHAIN,
  DonationToken,
  ERC20_ABI,
  Token,
  NULL_ADDRESS,
} from '@idriss-xyz/constants';
import {
  encodeFunctionData,
  Hex,
  isAddress,
  parseUnits,
  formatUnits,
} from 'viem';
import { Divider } from '@idriss-xyz/ui/divider';
import { useSendTransaction, useWallets } from '@privy-io/react-auth';
import {
  formatFiatValue,
  formatTokenValue,
  getChainById,
  getChainIdByNetworkName,
  getChainLogoById,
} from '@idriss-xyz/utils';

import {
  ChainSelect,
  TokenSelect,
} from '../../donate/components/donate-form/components';
import { TokenLogo } from '../../app/earnings/stats-and-history/token-logo';
import { TokenBalance } from '../../app/earnings/commands/get-balances';

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

function getNetworkKeyByChainId(chainId: number): string | undefined {
  const entry = Object.entries(CREATOR_CHAIN).find(([, value]) => {
    return value.id === chainId;
  });
  return entry?.[1].dbName;
}

export const WithdrawWidget = ({
  isOpen,
  balances,
  selectedToken,
  onClose,
}: WithdrawWidgetProperties) => {
  const [step, setStep] = useState<1 | 2>(1);
  const { wallets } = useWallets();
  const { sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [amountInTokens, setAmountInTokens] = useState<bigint>();
  const [visualAmount, setVisualAmount] = useState<string>();
  const [transactionHash, setTransactionHash] = useState<string>();
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
    setIsLoading(false);
    setIsSuccess(false);
    setAmountInTokens(undefined);
    setTransactionHash(undefined);
    setFormError(null);
    setVisualAmount(undefined);
    setIsMaxAmount(false);
  }, [onClose, formMethods]);

  useEffect(() => {
    if (isOpen) {
      if (selectedToken) {
        formMethods.setValue('tokenSymbol', selectedToken);
      } else if (balances.length > 0) {
        formMethods.setValue('tokenSymbol', balances[0]!.symbol);
      }
    }
  }, [isOpen, selectedToken, formMethods, balances]);

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
    if (networksForSelectedToken.length === 1) {
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
      setFormError(null);
      if (!values.amount || !values.tokenSymbol || !values.chainId) {
        return;
      }
      setIsLoading(true);

      const networkKey = getNetworkKeyByChainId(values.chainId);
      const balance = balances.find((b) => {
        return b.symbol === values.tokenSymbol && b.network === networkKey;
      });

      if (!balance || balance.usdValue <= 0) {
        setIsLoading(false);
        return;
      }

      let tokensToSend: bigint;
      if (isMaxAmount) {
        tokensToSend = parseUnits(balance.balance, balance.decimals);
      } else {
        const totalTokenBalance = parseUnits(balance.balance, balance.decimals);
        const totalUsdValue = balance.usdValue;
        const requestedUsdAmount = values.amount;

        // Use 18 decimals for high-precision floating point math, a common
        // standard in crypto, to prevent rounding errors.
        const precision = 1e18;
        const scaledRequestedAmount = BigInt(
          Math.round(requestedUsdAmount * precision),
        );
        const scaledTotalUsdValue = parseUnits(totalUsdValue.toString(), 18);

        if (scaledTotalUsdValue === 0n) {
          setIsLoading(false);
          return;
        }

        tokensToSend =
          (totalTokenBalance * scaledRequestedAmount) / scaledTotalUsdValue;
      }
      setAmountInTokens(tokensToSend);

      const isNative = tokenAddress === NULL_ADDRESS;
      const txRequest = isNative
        ? {
            to: values.withdrawalAddress as Hex,
            value: tokensToSend.toString(),
            data: undefined,
            chainId: values.chainId,
          }
        : {
            to: tokenAddress,
            value: '0',
            data: encodeFunctionData({
              abi: ERC20_ABI,
              functionName: 'transfer',
              args: [values.withdrawalAddress as Hex, tokensToSend],
            }),
            chainId: values.chainId,
          };

      try {
        const tx = await sendTransaction(txRequest, {
          uiOptions: {
            showWalletUIs: false,
          },
        });

        setTransactionHash(tx.hash);

        setIsLoading(false);
        setIsSuccess(true);
      } catch (error) {
        console.error('Failed to send transaction', error);
        if (
          error instanceof Error &&
          (error.message.toLowerCase().includes('insufficient funds') ||
            error.message
              .toLowerCase()
              .includes('gas required exceeds allowance'))
        ) {
          const chain = getChainById(values.chainId);
          const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
          setFormError(
            `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
          );
        } else {
          setFormError('Something went wrong. Try again in a few seconds.');
        }
        setIsLoading(false);
        setIsSuccess(false);
      }
    },
    [balances, tokenAddress, sendTransaction, isMaxAmount],
  );

  const onNextStep = useCallback(async () => {
    setFormError(null);

    const values = formMethods.getValues();
    const { amount: requestedUsdAmount, chainId, tokenSymbol } = values;

    const activeWallet = wallets[0];
    if (!activeWallet) {
      setFormError('Wallet not connected.');
      return;
    }

    const networkKey = getNetworkKeyByChainId(chainId);
    const balance = balances.find((b) => {
      return b.symbol === tokenSymbol && b.network === networkKey;
    });

    if (!balance || balance.usdValue <= 0) {
      return;
    }

    const totalUsdValue = balance.usdValue;
    let tokensToSend: bigint;
    if (isMaxAmount) {
      tokensToSend = parseUnits(balance.balance, balance.decimals);
    } else {
      const totalTokenBalance = parseUnits(balance.balance, balance.decimals);
      const precision = 1e18;
      const scaledRequestedAmount = BigInt(
        Math.round(requestedUsdAmount * precision),
      );
      const scaledTotalUsdValue = parseUnits(totalUsdValue.toString(), 18);

      if (scaledTotalUsdValue === 0n) {
        return;
      }
      tokensToSend =
        (totalTokenBalance * scaledRequestedAmount) / scaledTotalUsdValue;
    }
    const isNative = tokenAddress === NULL_ADDRESS;
    const DUMMY_RECIPIENT = '0x0000000000000000000000000000000000000001';

    const txForEstimation = isNative
      ? {
          from: activeWallet.address,
          to: DUMMY_RECIPIENT,
          value: `0x${tokensToSend.toString(16)}`,
        }
      : {
          from: activeWallet.address,
          to: tokenAddress,
          data: encodeFunctionData({
            abi: ERC20_ABI,
            functionName: 'transfer',
            args: [DUMMY_RECIPIENT as Hex, tokensToSend],
          }),
        };

    try {
      await activeWallet.switchChain(chainId);
      const provider = await activeWallet.getEthereumProvider();
      const [gas, gasPrice, nativeBalanceHex] = await Promise.all([
        provider.request({
          method: 'eth_estimateGas',
          params: [txForEstimation],
        }),
        provider.request({ method: 'eth_gasPrice', params: [] }),
        provider.request({
          method: 'eth_getBalance',
          params: [activeWallet.address, 'latest'],
        }),
      ]);

      const gasCost = BigInt(gas) * BigInt(gasPrice);
      const nativeBalance = BigInt(nativeBalanceHex);

      if (isNative) {
        if (nativeBalance < tokensToSend + gasCost) {
          const chain = getChainById(chainId);
          const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
          setFormError(
            `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
          );
          return;
        }

        if (isMaxAmount && nativeBalance > gasCost) {
          const newTokensToSend = nativeBalance - gasCost;
          const price = totalUsdValue / Number.parseFloat(balance.balance);
          const newAmountFloat = Number.parseFloat(
            formatUnits(newTokensToSend, balance.decimals),
          );
          const newAmountInUSD = newAmountFloat * price;

          formMethods.setValue('amount', newAmountInUSD, {
            shouldValidate: true,
          });
          setVisualAmount(formatFiatValue(newAmountInUSD));
        }
      } else if (nativeBalance < gasCost) {
        const chain = getChainById(chainId);
        const nativeCurrencySymbol = chain?.nativeCurrency.symbol ?? 'ETH';
        setFormError(
          `Not enough ${nativeCurrencySymbol} in your wallet to cover network fees.`,
        );
        return;
      }

      setStep(2);
    } catch {
      setFormError('Something went wrong. Try again in a few seconds.');
    }
  }, [wallets, formMethods, balances, tokenAddress, isMaxAmount]);

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
        if (isLoading) {
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
            >
              Withdrawing
            </IdrissSend.Loading>
          );
        }

        if (isSuccess) {
          return (
            <IdrissSend.Success
              heading="Withdrawal completed"
              className="p-5"
              onConfirm={handleClose}
              chainId={chainId}
              transactionHash={transactionHash as Hex}
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

              <div className="border-t border-t-neutral-300 px-6 py-3">
                <Button
                  intent="primary"
                  size="medium"
                  type="submit"
                  className="w-full"
                >
                  {step === 1 ? 'Continue' : 'Send'}
                </Button>
                {formError && (
                  <p className="mt-2 text-center text-sm text-red-500">
                    {formError}
                  </p>
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
