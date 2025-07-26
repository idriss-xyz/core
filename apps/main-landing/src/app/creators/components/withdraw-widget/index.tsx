import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  CHAIN_ID_TO_TOKENS,
  CREATOR_CHAIN,
  DonationToken,
  ERC20_ABI,
  Token,
  Chain,
} from '@idriss-xyz/constants';
import { encodeFunctionData, Hex } from 'viem';
import { Divider } from '@idriss-xyz/ui/divider';
import { useSendTransaction } from '@privy-io/react-auth';
import {
  formatFiatValue,
  formatTokenValue,
  getSafeNumber,
} from '@idriss-xyz/utils';

import {
  ChainSelect,
  TokenSelect,
} from '../../donate/components/donate-form/components';
import { useGetTokenPerDollar } from '../../donate/hooks/use-get-token-per-dollar';
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

// TODO: Extract
function getChainNameById(chainId: number): string | undefined {
  const entry = Object.values(CREATOR_CHAIN).find((chain) => {
    return chain.id === Number(chainId);
  });
  return entry?.name;
}

function getChainLogoById(chainId: number): string | undefined {
  const entry = Object.values(CREATOR_CHAIN).find((chain) => {
    return chain.id === Number(chainId);
  });
  return entry?.logo;
}

const databaseNameToChainMap = new Map<string, Chain>();
for (const chain of Object.values(CREATOR_CHAIN)) {
  databaseNameToChainMap.set(chain.dbName, chain);
}

function getChainByNetworkName(networkName: string): number | undefined {
  return databaseNameToChainMap.get(networkName)?.id;
}

function getNetworkKeyByChainId(chainId: number): string | undefined {
  const entry = Object.entries(CREATOR_CHAIN).find(([, value]) => {
    return value.id === chainId;
  });
  return entry?.[0];
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
  const getTokenPerDollarMutation = useGetTokenPerDollar();

  const formMethods = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: 0,
      tokenSymbol: selectedToken,
    },
  });

  const handleClose = useCallback(() => {
    onClose();
    setStep(1);
    formMethods.reset();
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
        return getChainByNetworkName(b.network);
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
      setIsLoading(true);

      const usdcToken = CHAIN_ID_TO_TOKENS[values.chainId]?.find((token) => {
        return token.symbol === 'USDC';
      });

      const tokenPerDollar = await getTokenPerDollarMutation.mutateAsync({
        chainId: values.chainId,
        buyToken: tokenAddress ?? '',
        sellToken: usdcToken?.address ?? '',
        amount: 10 ** (usdcToken?.decimals ?? 0),
      });
      const tokenPerDollarNormalised = Number(tokenPerDollar.price);
      const tokenToSend = CHAIN_ID_TO_TOKENS[chainId]?.find((token) => {
        return token.address === tokenAddress;
      });
      const { decimals, value } = getSafeNumber(
        tokenPerDollarNormalised * amount,
      );
      const valueAsBigNumber = BigInt(value.toString());
      const tokensToSend =
        (valueAsBigNumber * BigInt(10) ** BigInt(tokenToSend?.decimals ?? 0)) /
        BigInt(10) ** BigInt(decimals);

      setAmountInTokens(tokensToSend);

      const txData = encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [values.withdrawalAddress as Hex, tokensToSend],
      });

      try {
        const tx = await sendTransaction(
          {
            to: tokenAddress,
            chainId: chainId,
            data: txData,
            value: '0',
          },
          {
            uiOptions: {
              showWalletUIs: false,
            },
          },
        );

        setTransactionHash(tx.hash);

        setIsLoading(false);
        setIsSuccess(true);
      } catch (error) {
        console.error('Failed to send transaction', error);
        setIsLoading(false);
        setIsSuccess(false);
      }
    },
    [amount, chainId, getTokenPerDollarMutation, tokenAddress, sendTransaction],
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
                    ${formatFiatValue(amount)}
                  </span>{' '}
                  (
                  {amountInTokens
                    ? formatTokenValue(Number(amountInTokens) / 10 ** 18)
                    : '0'}{' '}
                  {tokenSymbol} )
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
              onConfirm={() => {
                formMethods.reset();
                onClose();
                setStep(1);
              }}
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
                          {getChainNameById(chainId)}
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
