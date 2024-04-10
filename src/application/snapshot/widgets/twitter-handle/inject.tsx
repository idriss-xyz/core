import { ErrorBoundary } from 'shared/monitoring';

import { getSnapshotFromTwitterHandle } from '../../utils';

import { Container } from './container';

interface Properties {
  handle: string;
}

export const Inject = ({ handle }: Properties) => {
  const snapshotName = getSnapshotFromTwitterHandle(handle);

  if (!snapshotName) {
    return null;
  }

  return (
    <ErrorBoundary exceptionEventName="snapshot-widget-twitter-handle-runtime-error">
      <Container snapshotName={snapshotName} />
    </ErrorBoundary>
  );
};
