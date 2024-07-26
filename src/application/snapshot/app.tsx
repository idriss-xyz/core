import { ErrorBoundary } from 'shared/observability';
import { useExtensionSettings } from 'shared/extension';
import { useHandleToUsernameMap, useTwitterLocationInfo } from 'host/twitter';

import {
  OrganizationProposalsContainer,
  ProposalMainContainer,
} from './widgets';

export const App = () => {
  const { experimentalFeatures } = useExtensionSettings();

  const {
    isTwitter,
    isTwitterHandlePage,
    isTwitterHomePage,
    twitterHandleFromPathname,
  } = useTwitterLocationInfo();

  const { data: daoHandles } = useHandleToUsernameMap('snapshot');
  const snapshotHandle = isTwitterHandlePage
    ? daoHandles?.[twitterHandleFromPathname.toLowerCase()]
    : undefined;

  if (!experimentalFeatures || !isTwitter) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="snapshot-runtime-error">
      {snapshotHandle ? (
        <OrganizationProposalsContainer
          userHandle={twitterHandleFromPathname}
          snapshotHandle={snapshotHandle}
          key={snapshotHandle}
        />
      ) : null}
      {isTwitterHomePage ? <ProposalMainContainer /> : null}
    </ErrorBoundary>
  );
};
