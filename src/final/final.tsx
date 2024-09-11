import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';

import { Proposals, UserWidgets, PolymarketMarkets } from './widgets';

export const Final = () => {
  const { enabled, experimentalFeatures } = useExtensionSettings();

  if (!enabled) {
    return null;
  }

  return (
    <ErrorBoundary>
      <UserWidgets />

      {experimentalFeatures ? (
        <>
          <PolymarketMarkets />
          <Proposals />
        </>
      ) : null}
    </ErrorBoundary>
  );
};
