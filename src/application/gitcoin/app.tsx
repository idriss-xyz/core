import { useTwitterLocationInfo } from 'host/twitter';
import { ErrorBoundary } from 'shared/monitoring';

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
