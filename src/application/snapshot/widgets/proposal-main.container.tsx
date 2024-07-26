import { useState } from 'react';

import { ErrorBoundary } from 'shared/observability';

import { useTwitterSnapshotWidgetsInfo } from '../hooks';

import { OrganizationProposalsContainer } from './organization-proposals.container';

export const ProposalMainContainer = () => {
  const [hiddenSnapshots, setHiddenSnapshots] = useState<string[]>([]);

  const { visibleSnapshotWidgetsInfo: visibleSnapshots } =
    useTwitterSnapshotWidgetsInfo({
      hidden: hiddenSnapshots,
    });

  const hideSnapshot = (snapshotName: string) => {
    setHiddenSnapshots((previous) => {
      return [...previous, snapshotName];
    });
  };

  return visibleSnapshots.map(({ name, top, twitterHandle }) => {
    return (
      <ErrorBoundary
        key={`snapshot-${name}-at-${top}`}
        exceptionEventName="snapshot-widget-twitter-main-runtime-error"
      >
        <OrganizationProposalsContainer
          userHandle={twitterHandle}
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
