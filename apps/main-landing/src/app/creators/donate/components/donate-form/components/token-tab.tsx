import { Token } from '@idriss-xyz/constants';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Form } from '@idriss-xyz/ui/form';
import { classes } from '@idriss-xyz/ui/utils';
import { Icon } from '@idriss-xyz/ui/icon';

import { FormPayload } from '@/app/creators/donate/schema';
import { SenderReturnType } from '@/app/creators/donate/hooks/use-sender';

import { TokenSelect } from './token-select';
import { ChainSelect } from './chain-select';

export const TokenTabContent = ({
  formMethods,
  defaultTokenSymbol,
  possibleTokens,
  allowedChainsIds,
  sender,
  selectedTokenSymbol,
  activeTab,
}: {
  formMethods: UseFormReturn<FormPayload, undefined>;
  defaultTokenSymbol: string;
  possibleTokens: Token[];
  allowedChainsIds: number[];
  sender: SenderReturnType;
  selectedTokenSymbol: string;
  activeTab: string;
}) => {
  return (
    <div>
      <Controller
        name="tokenAmount"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <>
              <Form.Field
                numeric
                {...field}
                className="mt-6"
                label="Amount"
                value={field.value?.toString() ?? ''}
                onChange={(value) => {
                  field.onChange(Number(value));
                }}
                prefixElement={<span>$</span>}
              />

              {!sender.haveEnoughBalance && (
                <span
                  className={classes(
                    'flex items-center gap-x-1 pt-1 text-label7 text-red-500 lg:text-label6',
                  )}
                >
                  <Icon name="AlertCircle" size={12} className="p-px" />
                  {activeTab === 'collectible'
                    ? 'You do not own this collectible.'
                    : `Not enough ${selectedTokenSymbol} in your wallet. Add funds to continue.`}
                </span>
              )}
            </>
          );
        }}
      />
      <Controller
        name="tokenSymbol"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <TokenSelect
              label="Token"
              value={field.value ?? defaultTokenSymbol}
              className="mt-4 w-full"
              tokens={possibleTokens}
              onChange={field.onChange}
            />
          );
        }}
      />
      <Controller
        name="chainId"
        control={formMethods.control}
        render={({ field }) => {
          return (
            <ChainSelect
              label="Network"
              value={field.value}
              className="mt-4 w-full"
              onChange={field.onChange}
              allowedChainsIds={allowedChainsIds}
            />
          );
        }}
      />
    </div>
  );
};
