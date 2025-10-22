import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';

import {
  UserWidgets,
  FollowOnFarcaster,
} from './widgets';
import { FollowTradingCopilot } from './widgets/follow-trading-copilot';

export const Final = () => {
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['entire-extension-enabled']) {
    return null;
  }

  return (
    <ErrorBoundary>
      <UserWidgets />
      <FollowOnFarcaster />
      <FollowTradingCopilot />
    </ErrorBoundary>
  );
};
