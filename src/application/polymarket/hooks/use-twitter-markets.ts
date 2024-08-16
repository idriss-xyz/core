import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  GetOriginalShortenedUrlCommand,
  useTwitterScraping,
} from 'host/twitter';
import { useCommandMutation } from 'shared/messaging';

import { GetConditionIdCommand } from '../commands';
import { isEventUrl } from '../utils';

export const useTwitterMarkets = () => {
  const { externalLinks } = useTwitterScraping();
  const originalShortenedUrlMutation = useCommandMutation(
    GetOriginalShortenedUrlCommand,
  );

  const conditionIdMutation = useCommandMutation(GetConditionIdCommand);

  const scrapedImageLinks = useMemo(() => {
    return externalLinks.filter((scrapedLink) => {
      // twitter posts 2 links next to each other which breaks our UI
      const img = scrapedLink.node.querySelector('img');
      return Boolean(img);
    });
  }, [externalLinks]);

  const availableUrls = scrapedImageLinks
    .map((scrapedImageLink) => {
      return scrapedImageLink.data.link;
    })
    .sort();

  return useQuery({
    queryKey: ['twitterMarkets', ...availableUrls],
    placeholderData: (previousData) => {
      return previousData;
    },

    queryFn: async () => {
      const results = await Promise.allSettled(
        scrapedImageLinks.map(async (link) => {
          const url = await originalShortenedUrlMutation.mutateAsync({
            url: link.data.link,
          });
          if (!isEventUrl(url)) {
            throw new Error('Url is not event url');
          }
          const conditionId = await conditionIdMutation.mutateAsync({ url });
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
