import { ErrorInfo, ReactNode, useCallback } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { logException } from '../utils';

interface Properties {
  exceptionEventName: string;
  children: ReactNode;
}

export const ErrorBoundary = ({ exceptionEventName, children }: Properties) => {
  const onRuntimeError = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      void logException({
        name: exceptionEventName,
        meta: {
          message: error.message,
          ...errorInfo,
        },
      });
    },
    [exceptionEventName],
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
