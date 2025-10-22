import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';

import {
  UserWidgets,
  FollowOnFarcaster,
} from './widgets';

export const Final = () => {
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['entire-extension-enabled']) {
    return null;
  }

  return (
    <ErrorBoundary>
      <UserWidgets />
      <FollowOnFarcaster />
    </ErrorBoundary>
  );
};
