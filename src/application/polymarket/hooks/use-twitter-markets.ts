import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  useTwitterExternalLinksPooling,
  GetOriginalShortenedUrlCommand,
} from 'host/twitter';

import { GetConditionIdCommand } from '../commands';
import { isEventUrl } from '../utils';

const getOriginalShortenedUrl = (url: string) => {
  const command = new GetOriginalShortenedUrlCommand({ url });
  return command.send();
};

const getConditionId = (url: string) => {
  const command = new GetConditionIdCommand({ url });
  return command.send();
};

export const useTwitterMarkets = () => {
  const { results } = useTwitterExternalLinksPooling();

  const imageLinks = useMemo(() => {
    return results.filter((result) => {
      // twitter posts 2 links next to each other which breaks our UI
      const img = result.node.querySelector('img');
      return Boolean(img);
    });
  }, [results]);

  const availableUrls = imageLinks
    .map((v) => {
      return v.url;
    })
    .sort();

  return useQuery({
    queryKey: ['twitterMarkets', ...availableUrls],
    placeholderData: (previousData) => {
      return previousData;
    },

    queryFn: async () => {
      const results = await Promise.allSettled(
        imageLinks.map(async (link) => {
          const url = await getOriginalShortenedUrl(link.url);
          if (!isEventUrl(url)) {
            throw new Error('Url is not event url');
          }
          const conditionId = await getConditionId(url);
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
