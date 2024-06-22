import { ErrorBoundary } from 'shared/observability';
import { useTwitterLocationInfo } from 'host/twitter';

import { DonationWidgetContainer } from './widgets';

export const App = () => {
  const { isTwitter, isTwitterHandlePage, twitterHandleFromPathname } =
    useTwitterLocationInfo();

  return (
    <ErrorBoundary exceptionEventName="gitcoin-runtime-error">
      {isTwitter ? (
        <DonationWidgetContainer
          handle={isTwitterHandlePage ? twitterHandleFromPathname : undefined}
        />
      ) : null}
    </ErrorBoundary>
  );
};
