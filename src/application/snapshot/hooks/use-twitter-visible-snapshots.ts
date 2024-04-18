import { useMemo } from 'react';

import { useTwitterUsersPooling } from 'shared/twitter';

import { getSnapshotUsernameNodes } from '../utils';

interface Properties {
  hidden: string[];
}

export const useTwitterVisibleSnapshots = ({ hidden }: Properties) => {
  const { results } = useTwitterUsersPooling();

  const snapshotUserNodes = useMemo(() => {
    return getSnapshotUsernameNodes(results);
  }, [results]);

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
