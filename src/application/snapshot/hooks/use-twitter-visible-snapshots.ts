import { useMemo } from 'react';

import { useTwitterScraping, useHandleToUsernameMap } from 'host/twitter';

interface Properties {
  hidden: string[];
}

export const useTwitterVisibleSnapshots = ({ hidden }: Properties) => {
  const { tweetAuthors } = useTwitterScraping();
  const { data: daoHandles } = useHandleToUsernameMap('snapshot');

  const snapshotUserNodes = useMemo(() => {
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

  const visibleSnapshots = useMemo(() => {
    return [
      ...new Set(
        snapshotUserNodes.map((user) => {
          return user.snapshotName;
        }),
      ),
    ]
      .filter((snapshotName) => {
        return !hidden.includes(snapshotName);
      })
      .map((snapshotName) => {
        return {
          name: snapshotName,
          top:
            snapshotUserNodes.find((node) => {
              return node.snapshotName === snapshotName;
            })?.top ?? 0,
        };
      });
  }, [hidden, snapshotUserNodes]);

  const visibleSnapshotsNames = useMemo(() => {
    return visibleSnapshots.map((snapshot) => {
      return snapshot.name;
    });
  }, [visibleSnapshots]);

  return { visibleSnapshots, visibleSnapshotsNames };
};
