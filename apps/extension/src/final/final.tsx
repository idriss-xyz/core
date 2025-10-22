import { useExtensionSettings } from 'shared/extension';
import { ErrorBoundary } from 'shared/observability';

import {
  UserWidgets,
} from './widgets';

export const Final = () => {
  const { extensionSettings } = useExtensionSettings();

  if (!extensionSettings['entire-extension-enabled']) {
    return null;
  }

  return (
    <ErrorBoundary>
      <UserWidgets />
    </ErrorBoundary>
  );
};
