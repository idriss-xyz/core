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

  const getOfficialNames = useCallback(
    (username: string) => {
      return {
        snapshot: handleMap.snapshot[username],
        tally: handleMap.tally[username],
        agora: handleMap.agora[username],
      };
    },
    [handleMap.agora, handleMap.snapshot, handleMap.tally],
  );

  const getProposalsSources = useCallback(
    (username: string) => {
      const officialNames = getOfficialNames(username);

      return Object.entries(officialNames)
        .filter((entry): entry is [ProposalSource, string] => {
          return Boolean(entry[1]);
        })
        .map((entry) => {
          return entry[0];
        });
    },
    [getOfficialNames],
  );

  const widgets: PostWidgetProposalData[] = useMemo(() => {
    if (!isHomePage) {
      return [];
    }

    return posts
      .map((post) => {
        const authorUsername = post.data.authorUsername.toLowerCase();
        if (hidden.includes(authorUsername)) {
          return;
        }

        const officialNames = getOfficialNames(authorUsername);

        const proposalsSources = getProposalsSources(authorUsername);

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
  }, [getOfficialNames, getProposalsSources, hidden, isHomePage, posts]);

  const userPageProposalWidget = useMemo(() => {
    if (!isUserPage || !username) {
      return;
    }

    const officialNames = getOfficialNames(username.toLowerCase());

    const proposalsSources = getProposalsSources(username.toLowerCase());

    if (proposalsSources.length === 0) {
      return;
    }

    return {
      top: 20,
      username,
      officialNames,
      proposalsSources,
    };
  }, [getOfficialNames, getProposalsSources, isUserPage, username]);

  const hideWidget = useCallback((authorUserName: string) => {
    setHidden((previous) => {
      return [...previous, authorUserName];
    });
  }, []);

  return {
    widgets,
    userPageProposalWidget,
    hideWidget,
  };
};
