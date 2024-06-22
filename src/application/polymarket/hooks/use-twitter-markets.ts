import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import {
  useTwitterExternalLinksPooling,
  GetOriginalShortenedUrlCommand,
} from 'host/twitter';
import { useCommandMutation } from 'shared/messaging';

import { GetConditionIdCommand } from '../commands';
import { isEventUrl } from '../utils';

export const useTwitterMarkets = () => {
  const results = useTwitterExternalLinksPooling();
  const originalShortenedUrlMutation = useCommandMutation(
    GetOriginalShortenedUrlCommand,
  );

  const conditionIdMutation = useCommandMutation(GetConditionIdCommand);

  const imageLinks = useMemo(() => {
    return results.filter((result) => {
      // twitter posts 2 links next to each other which breaks our UI
      const img = result.node.querySelector('img');
      return Boolean(img);
    });
  }, [results]);

  const availableUrls = imageLinks
    .map((v) => {
      return v.value;
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
          const url = await originalShortenedUrlMutation.mutateAsync({
            url: link.value,
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
