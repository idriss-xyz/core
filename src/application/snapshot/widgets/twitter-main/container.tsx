import { useCallback, useState } from 'react';

import { ErrorBoundary } from 'shared/monitoring';

import { useTwitterProposalsToDisplay } from '../../hooks';
import { Proposal } from '../proposal';

export const Container = () => {
  const [hiddenSnapshots, setHiddenSnapshots] = useState<string[]>([]);

  const { proposalsToDisplay } = useTwitterProposalsToDisplay({
    hidden: hiddenSnapshots,
  });

  const hideSnapshot = useCallback((snapshotName: string) => {
    setHiddenSnapshots((previous) => {
      return [...previous, snapshotName];
    });
  }, []);

  return proposalsToDisplay.map(({ data, top }) => {
    return (
      <ErrorBoundary
        key={data.id}
        exceptionEventName="snapshot-widget-twitter-main-runtime-error"
      >
        <Proposal
          data={data}
          className="absolute"
          top={top - 12}
          onHide={() => {
            hideSnapshot(data.space.id);
          }}
        />
      </ErrorBoundary>
    );
  });
};
