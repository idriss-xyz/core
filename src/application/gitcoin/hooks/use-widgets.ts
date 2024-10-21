import { useMemo } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { UserScrapingResult } from 'shared/scraping';
import { getNodeToInjectToUser, isHandleNode } from 'host/twitter'; // TODO: abstract this so it's not specific to Twitter, probably we need to accept it via Properties

import { GetApplicationsCommand } from '../commands';
import { selectTwitterApplications } from '../utils';
import { WidgetData } from '../types';

interface Properties {
  scrapedUsers: UserScrapingResult[];
  handle?: string;
  enabled: boolean;
}

export const useWidgetsData = ({ scrapedUsers, enabled }: Properties) => {
  const getApplicationsQuery = useCommandQuery({
    command: new GetApplicationsCommand({}),
    select: selectTwitterApplications,
    placeholderData: (previousData) => {
      return previousData;
    },
    enabled,
  });

  const widgets: WidgetData[] = useMemo(() => {
    if (!getApplicationsQuery.data) {
      return [];
    }

    return scrapedUsers
      .map((scrapedUser) => {
        const application = getApplicationsQuery.data.find((application) => {
          return (
            application.project.metadata.projectTwitter?.toLowerCase() ===
            scrapedUser.data.username.toLowerCase()
          );
        });

        if (!application) {
          return;
        }

        const {
          node,
          nodeId,
          top,
          data: { username },
        } = scrapedUser;

        const isHandleUser = isHandleNode(node as HTMLElement);

        const nodeToInject = getNodeToInjectToUser(node, isHandleUser);

        if (!nodeToInject || nodeToInject?.textContent === 'Follows you') {
          return;
        }

        return {
          top,
          application,
          username,
          isHandleUser,
          node: nodeToInject,
          nodeId,
          type: 'gitcoin' as const,
        };
      })
      .filter(Boolean);
  }, [getApplicationsQuery.data, scrapedUsers]);

  return { widgets };
};
