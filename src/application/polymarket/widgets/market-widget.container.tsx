import { memo, useCallback, useMemo } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { GetImageAsBase64Command } from 'shared/utils';

import {
  GetAvailabilityCommand,
  GetMarketByConditionIdCommand,
  GetTokenChanceCommand,
  GetTokensBooksCommand,
  GetTokensPricesCommand,
} from '../commands';
import { EnhancedToken, MarketData } from '../types';

import { Market } from './market-widget';

interface Properties {
  top: number;
  conditionId: string;
}

export const MarketWidgetContainer = memo(
  ({ conditionId, top }: Properties) => {
    const marketQuery = useCommandQuery({
      command: new GetMarketByConditionIdCommand({ conditionId }),
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

    const availabilityQuery = useCommandQuery({
      command: new GetAvailabilityCommand({}),
    });

    const imageUrl = marketQuery.data?.image ?? '';
    const imageQuery = useCommandQuery({
      command: new GetImageAsBase64Command({ url: imageUrl }),
      enabled: imageUrl.length > 0,
    });

    const tokensIds = useMemo(() => {
      if (!marketQuery.data) {
        return [];
      }
      return marketQuery.data.tokens.map((token) => {
        return token.token_id;
      });
    }, [marketQuery.data]);

    const tokensPricesQuery = useCommandQuery({
      command: new GetTokensPricesCommand({ tokensIds }),
      enabled: tokensIds.length > 0,
    });

    const tokensBooksQuery = useCommandQuery({
      command: new GetTokensBooksCommand({ tokensIds: tokensIds ?? [] }),
      enabled: tokensIds && tokensIds.length > 0,
    });

    const tokens: EnhancedToken[] = useMemo(() => {
      if (
        !tokensPricesQuery.data ||
        !marketQuery.data ||
        !tokensBooksQuery.data
      ) {
        return [];
      }

      return marketQuery.data.tokens
        .map((token) => {
          const price = tokensPricesQuery.data[token.token_id];
          const book = tokensBooksQuery.data[token.token_id];

          if (!price || !book) {
            return;
          }

          return { ...token, price, book };
        })
        .filter(Boolean);
    }, [marketQuery.data, tokensBooksQuery.data, tokensPricesQuery.data]);

    const tokenId = tokens[0]?.token_id ?? '';
    const chanceQuery = useCommandQuery({
      command: new GetTokenChanceCommand({ tokenId }),
      enabled: tokenId.length > 0,
    });

    const refresh = useCallback(async () => {
      await marketQuery.refetch();
      await tokensPricesQuery.refetch();
      await chanceQuery.refetch();
    }, [chanceQuery, marketQuery, tokensPricesQuery]);

    if (
      !marketQuery.data ||
      !tokensPricesQuery.data ||
      !imageQuery.data === undefined ||
      chanceQuery.data === undefined ||
      !availabilityQuery.data ||
      marketQuery.data.closed ||
      tokens.length === 0
    ) {
      return null;
    }

    console.log('rendering');

    return (
      <Market
        top={top}
        data={marketQuery.data}
        chance={chanceQuery.data}
        imageUrl={imageQuery.data ?? ''}
        tokens={tokens}
        isAvailable={availabilityQuery.data}
        onRefresh={refresh}
        defaultValues={{
          selectedTokenId: tokens[0]?.token_id,
        }}
      />
    );
  },
);

MarketWidgetContainer.displayName = 'MarketContainer';
