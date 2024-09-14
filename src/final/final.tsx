import { PolymarketApp } from 'application/polymarket';
import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';
import { LookUpWalletAddress } from 'application/look-up-wallet-address';

import { Proposals, UserWidgets } from './widgets';

export const Final = () => {
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['entire-extension-enabled']) {
    return null;
  }

  return (
    <ErrorBoundary>
      <LookUpWalletAddress />
      <UserWidgets />
      <PolymarketApp />
      <Proposals />
    </ErrorBoundary>
  );
};
