import { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

interface Properties {
  children: ReactNode;
}

export const ErrorBoundary = ({ children }: Properties) => {
  return (
    <ReactErrorBoundary
      fallbackRender={() => {
        return null;
      }}
      onError={() => {}}
    >
      {children}
    </ReactErrorBoundary>
  );
};
