import { useState } from 'react';

import { ErrorBoundary } from 'shared/observability';

import { useTwitterTallyWidgetsInfo } from '../hooks';

import { OrganizationProposalsContainer } from './organization-proposals.container';

export const ProposalMainContainer = () => {
  const [hiddenUsers, setHiddenUsers] = useState<string[]>([]);

  const { visibleTallyWidgetsInfo } = useTwitterTallyWidgetsInfo({
    hidden: hiddenUsers,
  });

  const hideTally = (tallyName: string) => {
    setHiddenUsers((previous) => {
      return [...previous, tallyName];
    });
  };

  return visibleTallyWidgetsInfo.map(({ name, top, twitterHandle }) => {
    return (
      <ErrorBoundary
        key={`${name}at_${top}`}
        exceptionEventName="tally-widget-twitter-main-runtime-error"
      >
        <OrganizationProposalsContainer
          userHandle={twitterHandle}
          className="absolute"
          top={top - 12}
          onClose={() => {
            hideTally(name);
          }}
        />
      </ErrorBoundary>
    );
  });
};
