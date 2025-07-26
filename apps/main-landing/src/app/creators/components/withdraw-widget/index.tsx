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
import { encodeFunctionData, Hex, parseUnits } from 'viem';
import { Divider } from '@idriss-xyz/ui/divider';
import { useSendTransaction } from '@privy-io/react-auth';
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
  const { sendTransaction } = useSendTransaction();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amountInTokens, setAmountInTokens] = useState<bigint>();
  const [transactionHash, setTransactionHash] = useState<string>();

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

  console.log(formMethods.getValues());

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
    console.log('chains', networksForSelectedToken);
    if (networksForSelectedToken.length === 1) {
      const chainId = networksForSelectedToken[0];
      console.log('chainId', chainId);
      if (chainId !== undefined) {
        formMethods.setValue('chainId', chainId);
      }
    } else {
      formMethods.resetField('chainId');
    }
  }, [networksForSelectedToken, formMethods]);

  const setAmount = useCallback(
    (value: number) => {
      return () => {
        formMethods.setValue('amount', value);
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
    console.log('Found balance', balance, 'for network', networkKey);
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
        !values.withdrawalAddress ||
        !values.tokenSymbol ||
        !values.chainId
      ) {
        console.error('Missing required fields');
        return;
      }
      if (                                                                                                                                                        
        values.withdrawalAddress.toLowerCase() === NULL_ADDRESS.toLowerCase()                                                                                     
      ) {                                                                                                                                                         
        console.error('Cannot withdraw to the null address.');                                                                                                    
        return;                                                                                                                                                   
      }  
      setIsLoading(true);

      const networkKey = getNetworkKeyByChainId(values.chainId);
      const balance = balances.find((b) => {
        return b.symbol === values.tokenSymbol && b.network === networkKey;
      });

      if (!balance || balance.usdValue <= 0) {
        console.error('Could not find balance or invalid USD value');
        setIsLoading(false);
        return;
      }

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
        console.error(
          'Total USD value is zero, cannot calculate tokens to send.',
        );
        setIsLoading(false);
        return;
      }

      const tokensToSend =
        (totalTokenBalance * scaledRequestedAmount) / scaledTotalUsdValue;
      console.log(tokensToSend);
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
        setIsLoading(false);
        setIsSuccess(false);
      }
    },
    [balances, tokenAddress, sendTransaction],
  );

  const onNextStep = useCallback(() => {
    setStep(2);
  }, []);

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
                          onChange={field.onChange}
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
                            onChange={field.onChange}
                            value={field.value}
                          />
                        );
                      }}
                    />
                  )}

                  <Controller
                    control={formMethods.control}
                    name="amount"
                    render={({ field }) => {
                      return (
                        <DesignSystemForm.Field
                          {...field}
                          className="mt-4"
                          value={field.value.toString()}
                          onChange={(value) => {
                            return field.onChange(Number(value));
                          }}
                          label="Amount"
                          numeric
                          prefixElement={<span>$</span>}
                        />
                      );
                    }}
                  />
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {totalBalanceOfTokenInUSD !== undefined &&
                      totalBalanceOfTokenInUSD !== 0 &&
                      [25, 50, 100].map((value) => {
                        return (
                          <Button
                            key={value}
                            className={classes(
                              'w-full',
                              amount === value &&
                                'border-mint-600 bg-mint-300 hover:border-mint-600 hover:bg-mint-300',
                            )}
                            intent="secondary"
                            size="medium"
                            onClick={setAmount(
                              (value / 100) * totalBalanceOfTokenInUSD,
                            )}
                          >
                            {value}%
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
                          ${amount}
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
                    render={({ field }) => {
                      return (
                        <DesignSystemForm.Field
                          {...field}
                          className="mb-3 px-6"
                          label="Withdrawal address"
                          placeholder="External wallet address"
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
              </div>
            </DesignSystemForm>
          </>
        );
      }}
    </IdrissSend.Container>
  );
};

WithdrawWidget.displayName = 'WithdrawWidget';
