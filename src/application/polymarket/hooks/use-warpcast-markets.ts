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
    return externalLinks.filter((scrapedLink) => {
      return isEventUrl(scrapedLink.data.link);
    });
  }, [externalLinks]);

  const availableUrls = externalLinks
    .map((scrapedLink) => {
      return scrapedLink.data.link;
    })
    .sort();

  return useQuery({
    queryKey: ['warpcastMarkets', ...availableUrls],
    placeholderData: (previousData) => {
      return previousData;
    },

    queryFn: async () => {
      const results = await Promise.allSettled(
        polymarketLinks.map(async (scrapedLink) => {
          const conditionId = await conditionIdMutation.mutateAsync({
            url: scrapedLink.data.link,
          });
          if (!conditionId) {
            return;
          }
          return { conditionId, top: scrapedLink.top };
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
