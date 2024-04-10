import { useTwitterPage } from 'shared/twitter';
import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/monitoring';

import { TwitterHandleWidget, TwitterMainWidget } from './widgets';

export const App = () => {
  const page = useTwitterPage();
  const { experimentalFeatures } = useExtensionSettings();

  if (!experimentalFeatures) {
    return null;
  }
  return (
    <ErrorBoundary exceptionEventName="snapshot-runtime-error">
      {page.name === 'twitter' && page.type === 'handle' ? (
        <TwitterHandleWidget handle={page.handle} />
      ) : null}
      {page.name === 'twitter' && page.type === 'main' ? (
        <TwitterMainWidget />
      ) : null}
    </ErrorBoundary>
  );
};
