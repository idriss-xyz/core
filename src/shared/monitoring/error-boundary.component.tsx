import { ErrorInfo, ReactNode, useCallback } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import { sendExceptionEvent } from './monitoring.library';

interface Properties {
  exceptionEventName: string;
  children: ReactNode;
}

export const ErrorBoundary = ({ exceptionEventName, children }: Properties) => {
  const onRuntimeError = useCallback(
    (error: Error, errorInfo: ErrorInfo) => {
      void sendExceptionEvent({
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
