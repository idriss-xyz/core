import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { MarketFormValues } from '../../polymarket.types';
import { marketFormSchema } from '../../polymarket.schema';
import { EMPTY_MARKET_FORM } from '../../polymarket.constants';

import { UseMarketFormProperties } from './use-market-form.types';

export const useMarketForm = ({
  defaultValues,
  availableBalance,
}: UseMarketFormProperties) => {
  const { control, watch, handleSubmit } = useForm<MarketFormValues>({
    defaultValues: {
      amount: defaultValues?.amount ?? EMPTY_MARKET_FORM.amount,
      selectedTokenId:
        defaultValues?.selectedTokenId ?? EMPTY_MARKET_FORM.selectedTokenId,
    },
    resolver: zodResolver(marketFormSchema(availableBalance)),
    mode: 'onChange',
  });

  const [selectedTokenId, amount] = watch(['selectedTokenId', 'amount']);

  return {
    amount,
    control,
    handleSubmit,
    selectedTokenId,
  };
};
