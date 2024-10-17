import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';
import { LookUpWalletAddress } from 'application/look-up-wallet-address';

import {
  Proposals,
  UserWidgets,
  PolymarketMarkets,
  FollowOnFarcaster,
} from './widgets';

export const Final = () => {
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['entire-extension-enabled']) {
    return null;
  }

  return (
    <ErrorBoundary>
      <LookUpWalletAddress />
      <UserWidgets />
      <PolymarketMarkets />
      <Proposals />
      <FollowOnFarcaster />
    </ErrorBoundary>
  );
};
