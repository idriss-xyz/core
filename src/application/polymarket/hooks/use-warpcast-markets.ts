import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useWarpcastScraping } from 'host/warpcast';
import { useCommandMutation } from 'shared/messaging';

import { GetConditionIdCommand } from '../commands';
import { isEventUrl } from '../utils';

export const useWarpcastMarkets = () => {
  const { externalLinks } = useWarpcastScraping();
  const conditionIdMutation = useCommandMutation(GetConditionIdCommand);

  const polymarketLinks = useMemo(() => {
    return externalLinks.filter((result) => {
      return isEventUrl(result.value);
    });
  }, [externalLinks]);

  const availableUrls = externalLinks
    .map((v) => {
      return v.value;
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
          const conditionId = await conditionIdMutation.mutateAsync({
            url: link.value,
          });
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
