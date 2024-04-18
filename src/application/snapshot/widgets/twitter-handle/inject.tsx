import { ErrorBoundary } from 'shared/monitoring';

import { getSnapshotFromTwitterUsername } from '../../utils';

import { Container } from './container';

interface Properties {
  handle: string;
}

export const Inject = ({ handle }: Properties) => {
  const snapshotName = getSnapshotFromTwitterUsername(handle);

  if (!snapshotName) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="snapshot-widget-twitter-handle-runtime-error">
      <Container snapshotName={snapshotName} />
    </ErrorBoundary>
  );
};
