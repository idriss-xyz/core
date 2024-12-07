import { ReactNode, useCallback } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { useObservabilityScope } from '../scope';

interface Properties {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: Properties) => {
  const observabilityScope = useObservabilityScope();
  const onRuntimeError = useCallback(
    (error: Error) => {
      observabilityScope.captureException(error);
    },
    [observabilityScope],
  );

  return (
    <ReactErrorBoundary
      fallbackRender={() => {
        return null;
      }}
      onError={onRuntimeError}
    >
      {children}
    </ReactErrorBoundary>
  );
};
