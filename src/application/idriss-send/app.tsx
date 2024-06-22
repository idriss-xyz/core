import { useTwitterLocationInfo } from 'host/twitter';
import { ErrorBoundary } from 'shared/observability';

import { SendWidgetContainer } from './widgets';

export const App = () => {
  const { isTwitter, twitterHandleFromPathname, isTwitterHandlePage } =
    useTwitterLocationInfo();

  return (
    <ErrorBoundary exceptionEventName="idriss-send-runtime-error">
      {isTwitter ? (
        <SendWidgetContainer
          handle={isTwitterHandlePage ? twitterHandleFromPathname : undefined}
        />
      ) : null}
    </ErrorBoundary>
  );
};
