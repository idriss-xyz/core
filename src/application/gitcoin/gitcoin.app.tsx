import { useTwitterPage } from 'shared/twitter';
import { ErrorBoundary } from 'shared/monitoring';

import { GitcoinDonationWidget } from './donation';

export const App = () => {
  const page = useTwitterPage();

  return (
    <ErrorBoundary exceptionEventName="gitcoin-runtime-error">
      {page.name === 'twitter' ? (
        <GitcoinDonationWidget
          handle={page.type === 'handle' ? page.handle : undefined}
        />
      ) : null}
    </ErrorBoundary>
  );
};
