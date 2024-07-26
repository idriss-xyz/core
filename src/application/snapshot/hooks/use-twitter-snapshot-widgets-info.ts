import { useMemo } from 'react';

import { useTwitterScraping, useHandleToUsernameMap } from 'host/twitter';

interface Properties {
  hidden: string[];
}

export const useTwitterSnapshotWidgetsInfo = ({ hidden }: Properties) => {
  const { tweetAuthors } = useTwitterScraping();
  const { data: daoHandles } = useHandleToUsernameMap('snapshot');

  const snapshotWidgets = useMemo(() => {
    if (!daoHandles) {
      return [];
    }

    return tweetAuthors
      .map((author) => {
        const snapshotName = daoHandles[author.value.toLowerCase()];
        return snapshotName ? { snapshotName, ...author } : undefined;
      })
      .filter(Boolean);
  }, [daoHandles, tweetAuthors]);

  const visibleSnapshotWidgetsInfo = useMemo(() => {
    return snapshotWidgets
      .filter((snapshotNode) => {
        return !hidden.includes(snapshotNode.snapshotName);
      })
      .map((snapshotNode) => {
        return {
          name: snapshotNode.snapshotName,
          top: snapshotNode.top,
          twitterHandle: snapshotNode.value,
        };
      });
  }, [hidden, snapshotWidgets]);

  const visibleSnapshotsNames = useMemo(() => {
    return visibleSnapshotWidgetsInfo.map((snapshot) => {
      return snapshot.name;
    });
  }, [visibleSnapshotWidgetsInfo]);

  return { visibleSnapshotWidgetsInfo, visibleSnapshotsNames };
};
