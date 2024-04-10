import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo } from 'react';

interface Properties {
  children: React.ReactNode;
}

export const WithQueryClient = ({ children }: Properties) => {
  const queryClient = useMemo(() => {
    return new QueryClient({
      defaultOptions: {
        queries: { retry: false, staleTime: Number.POSITIVE_INFINITY },
        mutations: { retry: false },
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
