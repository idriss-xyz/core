import { useCallback, useMemo, useState } from 'react';

import {
  useHandleToUsernameMap,
  useTwitterLocationInfo,
  useTwitterScraping,
} from 'host/twitter';
import { getAgoraUsernameFromTwitterUsername } from 'application/agora';

import { PostWidgetProposalData, ProposalSource } from '../types';

import { useApplicationStatus } from './use-application-status';

export const useProposalsWidgets = () => {
  const { posts } = useTwitterScraping();
  const applicationsStatus = useApplicationStatus();

  const { isTwitterHandlePage, isTwitterHomePage, twitterHandleFromPathname } =
    useTwitterLocationInfo();
  const [hidden, setHidden] = useState<string[]>([]);

  const { data: snapshotHandlesMap } = useHandleToUsernameMap(
    'snapshot',
    applicationsStatus.snapshot,
  );
  const { data: tallyHandlesMap } = useHandleToUsernameMap(
    'tally',
    applicationsStatus.tally,
  );

  const widgets: PostWidgetProposalData[] = useMemo(() => {
    return posts
      .map((post) => {
        if (hidden.includes(post.data.authorUsername)) {
          return;
        }

        const officialNames = {
          snapshot:
            snapshotHandlesMap?.[post.data.authorUsername.toLowerCase()],
          tally: tallyHandlesMap?.[post.data.authorUsername.toLowerCase()],
          agora: applicationsStatus.agora
            ? getAgoraUsernameFromTwitterUsername(
                post.data.authorUsername.toLowerCase(),
              )
            : undefined,
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
  }, [
    applicationsStatus.agora,
    hidden,
    posts,
    snapshotHandlesMap,
    tallyHandlesMap,
  ]);

  const userPageProposalWidget = useMemo(() => {
    if (!isTwitterHandlePage) {
      return;
    }

    const foundWidget = widgets.find((widget) => {
      return (
        widget.username.toLowerCase() ===
        twitterHandleFromPathname.toLowerCase()
      );
    });

    if (!foundWidget) {
      return;
    }

    return { ...foundWidget, top: 20 };
  }, [isTwitterHandlePage, widgets, twitterHandleFromPathname]);

  const hideWidget = useCallback((authorUserName: string) => {
    setHidden((previous) => {
      return [...previous, authorUserName];
    });
  }, []);

  return {
    widgets: isTwitterHomePage ? widgets : [],
    userPageProposalWidget,
    hideWidget,
  };
};
