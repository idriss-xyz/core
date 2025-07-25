import { useCallback, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@idriss-xyz/ui/button';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import {
  CHAIN_ID_TO_TOKENS,
  CREATOR_CHAIN,
  EMPTY_HEX,
} from '@idriss-xyz/constants';
import { Hex } from 'viem';

import {
  ChainSelect,
  TokenSelect,
} from '../../donate/components/donate-form/components';

import { IdrissSend } from './send';
// TODO: extract this component to avoid importing like this

type WithdrawFormValues = {
  amount: number;
  chainId: number;
  tokenAddress: string;
};

type WithdrawWidgetProperties = {
  isOpened: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  transactionHash?: string;
  onClose: () => void;
};

const ALL_CHAIN_IDS = Object.values(CREATOR_CHAIN).map((chain) => {
  return chain.id;
});

export const WithdrawWidget = ({
  isOpened,
  isLoading,
  isSuccess,
  transactionHash = EMPTY_HEX,
  onClose,
}: WithdrawWidgetProperties) => {
  const formMethods = useForm<WithdrawFormValues>({
    defaultValues: {
      amount: 0,
      chainId: ALL_CHAIN_IDS[0],
      tokenAddress: '',
    },
  });

  const formReference = useRef<HTMLFormElement | null>(null);
  const amount = formMethods.watch('amount');
  const chainId = formMethods.watch('chainId');
  const tokens = useMemo(() => {
    return CHAIN_ID_TO_TOKENS[chainId] ?? [];
  }, [chainId, CHAIN_ID_TO_TOKENS]);

  const setAmount = useCallback(
    (value: number) => {
      return () => {
        formMethods.setValue('amount', value);
      };
    },
    [formMethods],
  );

  const onSubmit = useCallback(() => {
    console.log('submit');
  }, []);

  return (
    <IdrissSend.Container
      isOpened={isOpened}
      recipientName="Withdraw" // TODO: Replace for recipientName
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
              heading={`Withdrawing $${amount}`}
            >
              Please wait while your withdrawal is being processed...
            </IdrissSend.Loading>
          );
        }

        if (isSuccess) {
          return (
            <IdrissSend.Success
              className="p-5"
              onConfirm={formMethods.reset}
              chainId={chainId}
              transactionHash={transactionHash as Hex}
            />
          );
        }

        return (
          <DesignSystemForm
            ref={formReference}
            className="px-6 py-3"
            onSubmit={formMethods.handleSubmit(onSubmit)}
          >
            <Controller
              control={formMethods.control}
              name="chainId"
              render={({ field }) => {
                return (
                  <ChainSelect
                    className="mt-2"
                    label="Network"
                    allowedChainsIds={ALL_CHAIN_IDS}
                    onChange={(value) => {
                      return field.onChange(value);
                    }}
                    value={field.value}
                  />
                );
              }}
            />

            <Controller
              control={formMethods.control}
              name="tokenAddress"
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

            <div className="mt-6">
              <Button
                intent="primary"
                size="medium"
                type="submit"
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </DesignSystemForm>
        );
      }}
    </IdrissSend.Container>
  );
};

WithdrawWidget.displayName = 'WithdrawWidget';
