import { useLocation } from 'react-use';

import {
  extractTwitterHandleFromPathname,
  isTwitterHandlePathname,
  isTwitterHostname,
} from 'host/twitter';
import { ErrorBoundary } from 'shared/monitoring';

import { DonationWidgetContainer } from './widgets';

export const App = () => {
  const location = useLocation();

  const isTwitter = isTwitterHostname(location.hostname ?? '');
  const isTwitterHandlePage = isTwitterHandlePathname(location.pathname ?? '');

  return (
    <ErrorBoundary exceptionEventName="gitcoin-runtime-error">
      {isTwitter ? (
        <DonationWidgetContainer
          handle={
            isTwitterHandlePage
              ? extractTwitterHandleFromPathname(location.pathname ?? '')
              : undefined
          }
        />
      ) : null}
    </ErrorBoundary>
  );
};
