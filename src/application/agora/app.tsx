import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/monitoring';
import { useTwitterLocationInfo } from 'host/twitter';

import { ProposalHandleContainer, ProposalMainContainer } from './widgets';

export const App = () => {
  const { experimentalFeatures } = useExtensionSettings();
  const {
    isTwitter,
    isTwitterHandlePage,
    isTwitterHomePage,
    twitterHandleFromPathname,
  } = useTwitterLocationInfo();

  if (!experimentalFeatures || !isTwitter) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="agora-runtime-error">
      {isTwitterHandlePage && (
        <ProposalHandleContainer handle={twitterHandleFromPathname} />
      )}
      {isTwitterHomePage && <ProposalMainContainer />}
    </ErrorBoundary>
  );
};
