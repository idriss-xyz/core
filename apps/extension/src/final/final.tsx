import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';
import { LookUpWalletAddress } from 'application/look-up-wallet-address';

import {
  Proposals,
  UserWidgets,
  PolymarketMarkets,
  FollowOnFarcaster,
  YapsStats,
} from './widgets';
import { FollowTradingCopilot } from './widgets/follow-trading-copilot';

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
      <FollowTradingCopilot />
      <YapsStats />
    </ErrorBoundary>
  );
};
