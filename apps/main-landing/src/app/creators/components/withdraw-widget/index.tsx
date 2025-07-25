import { useCallback, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  CHAIN_ID_TO_TOKENS,
  CREATOR_CHAIN,
  ERC20_ABI,
} from '@idriss-xyz/constants';
import { encodeFunctionData, Hex } from 'viem';
import { Icon } from '@idriss-xyz/ui/icon';
import { useSendTransaction } from '@privy-io/react-auth';
import { formatTokenValue, getSafeNumber } from '@idriss-xyz/utils';

import {
  ChainSelect,
  TokenSelect,
} from '../../donate/components/donate-form/components';
import { TokenLogo } from '../../app/earnings/stats/token-logo';
import { useGetTokenPerDollar } from '../../donate/hooks/use-get-token-per-dollar';

import { IdrissSend } from './send';

type WithdrawFormValues = {
  amount: number;
  chainId: number;
  tokenSymbol: string;
  withdrawalAddress: string;
};

type WithdrawWidgetProperties = {
  isOpen: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  transactionHash?: string;
  onClose: () => void;
};

const ALL_CHAIN_IDS = Object.values(CREATOR_CHAIN).map((chain) => {
  return chain.id;
});

// TODO: Extract
function getTokenAddress(chainId: number, tokenSymbol: string) {
  console.log('Getting token address:', chainId, tokenSymbol);
  const tokens = CHAIN_ID_TO_TOKENS[chainId];
  if (!tokens) return;

  const token = tokens.find((t) => {
    return t.symbol === tokenSymbol;
  });
  return token?.address;
}

// TODO: Extract
function getChainNameById(chainId: number): string | undefined {
  const entry = Object.values(CREATOR_CHAIN).find((chain) => {
    return chain.id === Number(chainId);
  });
  return entry?.name;
}

export const WithdrawWidget = ({
  isOpen,
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
      chainId: ALL_CHAIN_IDS[0],
    },
  });

  const formReference = useRef<HTMLFormElement | null>(null);
  const amount = formMethods.watch('amount');
  const chainId = formMethods.watch('chainId');
  const tokenSymbol = formMethods.watch('tokenSymbol');
  const withdrawalAddress = formMethods.watch('withdrawalAddress');

  const tokens = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId] ?? [];
  }, [chainId]);

  const setAmount = useCallback(
    (value: number) => {
      return () => {
        formMethods.setValue('amount', value);
      };
    },
    [formMethods],
  );

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
      const tokenAddress =
        getTokenAddress(values.chainId, values.tokenSymbol) ?? '';
      console.log('Amount on form:', values.amount);
      console.log(
        'Token amount:',
        Number(values.amount) * 10 ** (usdcToken?.decimals ?? 0),
      );

      const tokenPerDollar = await getTokenPerDollarMutation.mutateAsync({
        chainId: values.chainId,
        buyToken: tokenAddress,
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
    [amount, chainId, getTokenPerDollarMutation, sendTransaction],
  );

  const onNextStep = useCallback(() => {
    setStep(2);
  }, []);

  return (
    <IdrissSend.Container
      isOpened={isOpen}
      onClose={onClose}
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
                  Sending <span className="text-mint-600">${amount}</span> (
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
                  name="chainId"
                  render={({ field }) => {
                    return (
                      <ChainSelect
                        className="mt-2"
                        label="Network"
                        allowedChainsIds={ALL_CHAIN_IDS}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    );
                  }}
                />

                <Controller
                  control={formMethods.control}
                  name="tokenSymbol"
                  render={({ field }) => {
                    return (
                      <TokenSelect
                        className="mt-4"
                        label="Token"
                        tokens={tokens}
                        onChange={field.onChange}
                        value={field.value}
                      />
                    );
                  }}
                />
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
                  {[25, 50, 100].map((value) => {
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
                        onClick={setAmount(value)}
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
                      <span>{tokenSymbol}</span> {/* TODO: make dynamic */}
                      <span className="hidden">
                        {getTokenAddress(chainId, tokenSymbol)}
                      </span>{' '}
                      {/* TODO: Use this for form submit */}
                      <span className="bg-mint-200 p-1 text-label6 text-mint-700">
                        ${amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-label4">Selected network</span>
                    <div className="flex flex-row gap-[10px] text-label4">
                      <Icon
                        size={24}
                        name="GlobeIcon"
                        className="rounded-full bg-neutral-500"
                      />{' '}
                      {/* TODO: make dynamic w chainId */}
                      <span>{getChainNameById(chainId)}</span>
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
                        label="Withdrawal Address"
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
        );
      }}
    </IdrissSend.Container>
  );
};

WithdrawWidget.displayName = 'WithdrawWidget';
