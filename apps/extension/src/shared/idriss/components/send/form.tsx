import { Controller, UseFormReturn } from 'react-hook-form';
import { Form as DesignSystemForm } from '@idriss-xyz/ui/form';
import { ReactNode, useCallback, useRef } from 'react';
import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';

import { ChainSelect, ChainToken, TokenSelect } from 'shared/web3';

import { SendFormValues } from '../../types';

interface Properties {
  footer: ReactNode;
  className?: string;
  allowedChainsIds: number[];
  tokens: ChainToken[];
  formMethods: UseFormReturn<SendFormValues>;
  onSubmit: (v: SendFormValues) => void;
  renderChainSuffix?: (chainId: number) => ReactNode;
  onChangeChainId?: (chainId: number) => void;
}

export const Form = ({
  footer,
  tokens,
  className,
  formMethods,
  allowedChainsIds,
  onSubmit,
  onChangeChainId,
  renderChainSuffix,
}: Properties) => {
  const amount = formMethods.watch('amount');
  const formReference = useRef<HTMLFormElement | null>(null);

  const setAmount = useCallback(
    (value: number) => {
      return () => {
        formMethods.setValue('amount', value);
      };
    },
    [formMethods],
  );

  return (
    <DesignSystemForm
      ref={formReference}
      className={className}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <div className="px-6 py-3">
        <Controller
          control={formMethods.control}
          name="amount"
          render={({ field }) => {
            return (
              <DesignSystemForm.Field
                {...field}
                value={field.value.toString()}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                label="Amount ($)"
                numeric
              />
            );
          }}
        />

        <div className="mt-2 grid grid-cols-3 gap-4">
          {/* TODO: iterate over constant */}
          <Button
            className={classes(
              'w-full',
              amount === 1 &&
                'border-mint-600 bg-mint-300 hover:border-mint-600 hover:bg-mint-300',
            )}
            intent="secondary"
            size="medium"
            onClick={setAmount(1)}
          >
            $1
          </Button>
          <Button
            className={classes(
              'w-full',
              amount === 2 &&
                'border-mint-600 bg-mint-300 hover:border-mint-600 hover:bg-mint-300',
            )}
            intent="secondary"
            size="medium"
            onClick={setAmount(2)}
          >
            $2
          </Button>
          <Button
            className={classes(
              'w-full',
              amount === 5 &&
                'border-mint-600 bg-mint-300 hover:border-mint-600 hover:bg-mint-300',
            )}
            intent="secondary"
            size="medium"
            onClick={setAmount(5)}
          >
            $5
          </Button>
        </div>
        <Controller
          control={formMethods.control}
          name="chainId"
          render={({ field }) => {
            return (
              <ChainSelect
                className="mt-4"
                label="Network"
                allowedChainsIds={allowedChainsIds}
                renderSuffix={renderChainSuffix}
                onChange={(value) => {
                  onChangeChainId?.(value);
                  field.onChange(value);
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
      </div>
      <div className="border-t border-t-neutral-200 px-6 py-3">{footer}</div>
    </DesignSystemForm>
  );
};
