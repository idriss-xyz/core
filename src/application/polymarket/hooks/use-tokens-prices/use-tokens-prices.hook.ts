import { useQuery } from '@tanstack/react-query';

import { GetTokensPricesCommand } from '../../commands';
import { TokenIdToPrice } from '../../polymarket.types';

import { UseTokensPriceArguments } from './use-tokens-prices.types';

const getTokensPrices = async (tokensIds: string[]) => {
  const command = new GetTokensPricesCommand({ tokensIds });
  return command.send<TokenIdToPrice>();
};

// TODO: there is literally endpoint getPrices but we cannot use it because with fetch you cannot GET with body
export const useTokensPrices = ({ tokensIds }: UseTokensPriceArguments) => {
  return useQuery({
    enabled: tokensIds.length > 0,
    queryKey: ['getTokenPrice', ...tokensIds],
    queryFn: () => {
      return getTokensPrices(tokensIds);
    },
  });
};
