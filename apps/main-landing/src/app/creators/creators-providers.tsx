'use client';

import { AuthProvider } from './context/auth-context';
import { PrivyAuthSync } from './privy-auth-sync';
import { Providers } from './providers';

export function CreatorsProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <PrivyAuthSync />

        {children}
      </AuthProvider>
    </Providers>
  );
}
