'use client';

import { AuthProvider } from './context/auth-context';
import { Providers } from './providers';

export function CreatorsProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthProvider>{children}</AuthProvider>
    </Providers>
  );
}
