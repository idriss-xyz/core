import { useLocation } from 'react-use';

import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/monitoring';
import {
  extractTwitterHandleFromPathname,
  isTwitterHandlePathname,
  isTwitterHomePathname,
  isTwitterHostname,
} from 'host/twitter';

import { ProposalHandleContainer, ProposalMainContainer } from './widgets';

export const App = () => {
  const location = useLocation();
  const { experimentalFeatures } = useExtensionSettings();

  // TODO: hide these behind facade
  const isTwitter = isTwitterHostname(location.hostname ?? '');
  const isTwitterHandlePage = isTwitterHandlePathname(location.pathname ?? '');
  const isTwitterHomePage = isTwitterHomePathname(location.pathname ?? '');

  if (!experimentalFeatures || !isTwitter) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="snapshot-runtime-error">
      {isTwitterHandlePage ? (
        <ProposalHandleContainer
          handle={extractTwitterHandleFromPathname(location.pathname ?? '')}
        />
      ) : null}
      {isTwitterHomePage ? <ProposalMainContainer /> : null}
    </ErrorBoundary>
  );
};
