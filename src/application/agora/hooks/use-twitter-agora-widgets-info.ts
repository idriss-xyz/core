import { useMemo } from 'react';

import { useTwitterScraping } from 'host/twitter';

import { getAgoraWidgetsInfo } from '../utils';

interface Properties {
  hidden: string[];
}

export const useTwitterAgoraWidgetsInfo = ({ hidden }: Properties) => {
  const { users } = useTwitterScraping();

  const agoraWidgets = useMemo(() => {
    return getAgoraWidgetsInfo(users);
  }, [users]);

  const visibleAgoraWidgetsInfo = useMemo(() => {
    return agoraWidgets
      .filter((node) => {
        return !hidden.includes(node.agoraUsername);
      })
      .map((node) => {
        return {
          username: node.agoraUsername,
          top: node.top,
          twitterHandle: node.value,
        };
      });
  }, [agoraWidgets, hidden]);

  return { visibleAgoraWidgetsInfo };
};
