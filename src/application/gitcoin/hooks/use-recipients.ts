import { useMemo } from 'react';

import { useCommandQuery } from 'shared/messaging';
import { ScrapingResult } from 'shared/scraping';
import { getNodeToInjectToUser, isHandleNode } from 'host/twitter'; // TODO: abstract this so it's not specific to Twitter, probably we need to accept it via Properties

import { GetApplicationsCommand } from '../commands';
import { selectTwitterApplications } from '../utils';
import { Recipient } from '../types';

interface Properties {
  users: ScrapingResult[];
  handle?: string;
  enabled: boolean;
}

export const useRecipients = ({ users, handle, enabled }: Properties) => {
  const getApplicationsQuery = useCommandQuery({
    command: new GetApplicationsCommand({}),
    select: selectTwitterApplications,
    placeholderData: (previousData) => {
      return previousData;
    },
    enabled,
  });

  const recipients: Recipient[] = useMemo(() => {
    if (!getApplicationsQuery.data) {
      return [];
    }

    return users
      .map((user) => {
        const application = getApplicationsQuery.data.find((application) => {
          return (
            application.project.metadata.projectTwitter?.toLowerCase() ===
            user.value.toLowerCase()
          );
        });

        if (!application) {
          return;
        }

        const { value: username, node, top } = user;

        const isHandleUser =
          handle === username && isHandleNode(node as HTMLElement);

        const nodeToInject = getNodeToInjectToUser(node, isHandleUser);

        if (!nodeToInject || nodeToInject?.textContent === 'Follows you') {
          return;
        }

        return {
          top,
          application,
          username,
          isHandleUser,
          nodeToInject,
        };
      })
      .filter(Boolean);
  }, [getApplicationsQuery.data, handle, users]);

  return { recipients };
};
