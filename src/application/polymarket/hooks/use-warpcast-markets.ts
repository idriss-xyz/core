import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useWarpcastExternalLinksPooling } from 'src/host/warpcast';

import { GetConditionIdCommand } from '../commands';
import { isEventUrl } from '../utils';

const getConditionId = (url: string) => {
  const command = new GetConditionIdCommand({ url });
  return command.send();
};

export const useWarpcastMarkets = () => {
  const { results } = useWarpcastExternalLinksPooling();

  const polymarketLinks = useMemo(() => {
    return results.filter((result) => {
      return isEventUrl(result.url);
    });
  }, [results]);

  const availableUrls = results
    .map((v) => {
      return v.url;
    })
    .sort();

  return useQuery({
    queryKey: ['warpcastMarkets', ...availableUrls],
    placeholderData: (previousData) => {
      return previousData;
    },

    queryFn: async () => {
      const results = await Promise.allSettled(
        polymarketLinks.map(async (link) => {
          const conditionId = await getConditionId(link.url);
          if (!conditionId) {
            return;
          }
          return { conditionId, top: link.top };
        }),
      );

      return results
        .map((result) => {
          return result.status === 'fulfilled' && Boolean(result.value)
            ? result.value
            : undefined;
        })
        .filter(Boolean);
    },
  });
};
