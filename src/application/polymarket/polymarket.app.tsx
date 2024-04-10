import { useTwitterPage } from 'shared/twitter';
import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/monitoring';

import { TwitterPolymarketWidget } from './widgets';

export const App = () => {
  const page = useTwitterPage();
  const { experimentalFeatures } = useExtensionSettings();

  if (!experimentalFeatures) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="polymarket-runtime-error">
      {page.name === 'twitter' ? <TwitterPolymarketWidget /> : null}
    </ErrorBoundary>
  );
};
