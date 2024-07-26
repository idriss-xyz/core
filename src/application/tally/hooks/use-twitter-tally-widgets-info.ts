import { useMemo } from 'react';

import { useHandleToUsernameMap, useTwitterScraping } from 'host/twitter';

interface Properties {
  hidden: string[];
}

export const useTwitterTallyWidgetsInfo = ({ hidden }: Properties) => {
  const { tweetAuthors } = useTwitterScraping();
  const { data: daoHandles } = useHandleToUsernameMap('tally');

  const tallyWidgets = useMemo(() => {
    if (!daoHandles) {
      return [];
    }

    return tweetAuthors
      .map((author) => {
        const tallyName = daoHandles[author.value.toLowerCase()];
        return tallyName ? { tallyName, ...author } : undefined;
      })
      .filter(Boolean);
  }, [daoHandles, tweetAuthors]);

  const visibleTallyWidgetsInfo = useMemo(() => {
    return tallyWidgets
      .filter((tallyNode) => {
        return !hidden.includes(tallyNode.tallyName);
      })
      .map((tallyNode) => {
        return {
          twitterHandle: tallyNode.value,
          name: tallyNode.tallyName,
          top: tallyNode.top,
        };
      });
  }, [hidden, tallyWidgets]);

  return { visibleTallyWidgetsInfo };
};
