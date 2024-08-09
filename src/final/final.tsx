import { PolymarketApp } from 'application/polymarket';
import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';

import { Proposals, UserWidgets } from './widgets';

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
          <PolymarketApp />
          <Proposals />
        </>
      ) : null}
    </ErrorBoundary>
  );
};
