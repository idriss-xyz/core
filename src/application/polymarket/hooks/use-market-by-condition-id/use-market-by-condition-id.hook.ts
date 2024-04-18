import { useQuery } from '@tanstack/react-query';

import { GetMarketByConditionIdCommand } from '../../commands';
import { MarketData } from '../../polymarket.types';

import { UseMarketByConditionIdArguments } from './use-market-by-condition-id.types';

const getMarketByConditionId = async (conditionId: string) => {
  const command = new GetMarketByConditionIdCommand({ conditionId });
  return command.send();
};

export const useMarketByConditionId = ({
  conditionId,
}: UseMarketByConditionIdArguments) => {
  return useQuery({
    queryKey: ['getMarketByConditionId', conditionId],
    queryFn: () => {
      return getMarketByConditionId(conditionId);
    },
    placeholderData: (previousData) => {
      return previousData;
    },

    select: (data): MarketData => {
      return {
        ...data,
        tokens:
          // TODO: polymarket util sortByOutcome
          data.tokens.sort((tokenA, tokenB) => {
            return tokenA.outcome === 'Yes'
              ? -1
              : tokenB.outcome === 'Yes'
                ? 1
                : 0;
          }) ?? [],
      };
    },
  });
};
