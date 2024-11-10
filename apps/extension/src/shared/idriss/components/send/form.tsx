import { Controller, UseFormReturn } from 'react-hook-form';
import { ReactNode, useRef } from 'react';

import { IdrissMoneyInput } from 'shared/ui';
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
  const formReference = useRef<HTMLFormElement | null>(null);

  return (
    <form
      ref={formReference}
      className={className}
      onSubmit={formMethods.handleSubmit(onSubmit)}
    >
      <div className="px-6 py-3">
        <Controller
          control={formMethods.control}
          name="amount"
          render={({ field, fieldState }) => {
            return (
              <IdrissMoneyInput
                value={field.value}
                onChange={field.onChange}
                errorMessage={fieldState.error?.message}
              />
            );
          }}
        />
        <Controller
          control={formMethods.control}
          name="chainId"
          render={({ field }) => {
            return (
              <ChainSelect
                className="mt-5"
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
                className="mt-1"
                label="Token"
                tokens={tokens}
                onChange={field.onChange}
                value={field.value}
              />
            );
          }}
        />
      </div>
      <div className="border-t border-t-neutral-300 px-6 py-3">{footer}</div>
    </form>
  );
};
