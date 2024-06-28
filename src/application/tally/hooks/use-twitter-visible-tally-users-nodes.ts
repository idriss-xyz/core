import { useMemo } from 'react';

import { useHandleToUsernameMap, useTwitterScraping } from 'host/twitter';

interface Properties {
  hidden: string[];
}

export const useTwitterVisibleTallyUsersNodes = ({ hidden }: Properties) => {
  const { tweetAuthors } = useTwitterScraping();
  const { data: daoHandles } = useHandleToUsernameMap('tally');

  const tallyUserNodes = useMemo(() => {
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

  const visibleTallyNodes = useMemo(() => {
    return tallyUserNodes
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
  }, [hidden, tallyUserNodes]);

  return { visibleTallyNodes };
};
