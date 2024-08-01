import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { useMemo } from 'react';

import { useObservabilityScope } from 'shared/observability';

interface Properties {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: Properties) => {
  const observabilityScope = useObservabilityScope();

  const queryClient = useMemo(() => {
    return new QueryClient({
      mutationCache: new MutationCache({
        onError: (error, _variables, _context, mutation) => {
          observabilityScope.setContext('mutation', {
            mutationId: mutation.mutationId,
            variables: mutation.state.variables,
          });
          if (mutation.options.mutationKey) {
            observabilityScope.setFingerprint(
              // Duplicate to prevent modification
              [...mutation.options.mutationKey] as string[],
            );
          }
          observabilityScope.captureException(error);
        },
      }),
      queryCache: new QueryCache({
        onError: (error, query) => {
          observabilityScope.setContext('query', {
            queryHash: query.queryHash,
          });
          observabilityScope.setFingerprint([
            query.queryHash.replaceAll(/\d/g, '0'),
          ]);
          observabilityScope.captureException(error);
        },
      }),
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: Number.POSITIVE_INFINITY,
        },
        mutations: { retry: false },
      },
    });
  }, [observabilityScope]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
