import { useMemo } from 'react';

import { useProposals } from './use-proposals';
import { useTwitterVisibleSnapshots } from './use-twitter-visible-snapshots';

interface Properties {
  hidden: string[];
}

export const useTwitterProposalsToDisplay = ({ hidden }: Properties) => {
  const { visibleSnapshots, visibleSnapshotsNames } =
    useTwitterVisibleSnapshots({
      hidden,
    });

  const proposalsQuery = useProposals(visibleSnapshotsNames.sort());

  const proposalsToDisplay = useMemo(() => {
    return visibleSnapshots
      .map((snapshot) => {
        const data = proposalsQuery.data?.find((proposal) => {
          return proposal.space.id === snapshot.name;
        });

        if (!data) {
          return;
        }

        return { data, top: snapshot.top };
      })
      .filter(Boolean);
  }, [proposalsQuery.data, visibleSnapshots]);

  return { proposalsToDisplay };
};
