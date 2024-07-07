import { useState } from 'react';

import { ErrorBoundary } from 'shared/observability';

import { useTwitterVisibleSnapshots } from '../hooks';

import { OrganizationProposalsContainer } from './organization-proposals.container';

export const ProposalMainContainer = () => {
  const [hiddenSnapshots, setHiddenSnapshots] = useState<string[]>([]);

  const { visibleSnapshots } = useTwitterVisibleSnapshots({
    hidden: hiddenSnapshots,
  });

  const hideSnapshot = (snapshotName: string) => {
    setHiddenSnapshots((previous) => {
      return [...previous, snapshotName];
    });
  };

  return visibleSnapshots.map(({ name, top }) => {
    return (
      <ErrorBoundary
        key={`snapshot-${name}-at-${top}`}
        exceptionEventName="snapshot-widget-twitter-main-runtime-error"
      >
        <OrganizationProposalsContainer
          snapshotHandle={name}
          className="absolute"
          top={top - 12}
          onClose={() => {
            hideSnapshot(name);
          }}
        />
      </ErrorBoundary>
    );
  });
};
