import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { useTwitterExternalLinksPooling } from 'shared/twitter';

import { GetConditionIdCommand } from '../../commands';

const getConditionId = (url: string) => {
  const command = new GetConditionIdCommand({ url });
  return command.send<string>();
};

export const useTwitterMarkets = () => {
  const { links } = useTwitterExternalLinksPooling();

  const imageLinks = useMemo(() => {
    return links.filter((link) => {
      // twitter posts 2 links next to each other which breaks our UI
      const img = link.node.querySelector('img');
      return Boolean(img);
    });
  }, [links]);

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
