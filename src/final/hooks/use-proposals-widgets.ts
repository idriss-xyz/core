import { useCallback, useMemo, useState } from 'react';

import { PostWidgetProposalData, ProposalSource } from '../types';

import { useLocationInfo } from './use-location-info';
import { useScraping } from './use-scraping';
import { useHandleToOfficialName } from './use-handle-to-official-name';

export const useProposalsWidgets = () => {
  const { posts } = useScraping();

  const { isUserPage, isHomePage, username } = useLocationInfo();
  const [hidden, setHidden] = useState<string[]>([]);

  const handleMap = useHandleToOfficialName();

  const widgets: PostWidgetProposalData[] = useMemo(() => {
    return posts
      .map((post) => {
        if (hidden.includes(post.data.authorUsername)) {
          return;
        }

        const officialNames = {
          snapshot: handleMap.snapshot[post.data.authorUsername.toLowerCase()],
          tally: handleMap.tally[post.data.authorUsername.toLowerCase()],
          agora: handleMap.agora[post.data.authorUsername.toLowerCase()],
        };

        const proposalsSources = Object.entries(officialNames)
          .filter((entry): entry is [ProposalSource, string] => {
            return Boolean(entry[1]);
          })
          .map((entry) => {
            return entry[0];
          });

        if (proposalsSources.length === 0) {
          return;
        }

        return {
          top: post.top,
          username: post.data.authorUsername,
          officialNames,
          proposalsSources,
        };
      })
      .filter(Boolean);
  }, [handleMap.agora, handleMap.snapshot, handleMap.tally, hidden, posts]);

  const userPageProposalWidget = useMemo(() => {
    if (!isUserPage || !username) {
      return;
    }

    const foundWidget = widgets.find((widget) => {
      return widget.username.toLowerCase() === username.toLowerCase();
    });

    if (!foundWidget) {
      return;
    }

    return { ...foundWidget, top: 20 };
  }, [isUserPage, username, widgets]);

  const hideWidget = useCallback((authorUserName: string) => {
    setHidden((previous) => {
      return [...previous, authorUserName];
    });
  }, []);

  return {
    widgets: isHomePage ? widgets : [],
    userPageProposalWidget,
    hideWidget,
  };
};
