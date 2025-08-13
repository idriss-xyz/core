'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import { abstract, base, mainnet, ronin } from 'viem/chains';

import { AuthProvider } from './context/auth-context';
import { PrivyAuthSync } from './privy-auth-sync';
import { Providers } from './providers';

export function CreatorsProviders({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
          config={{
            embeddedWallets: {
              showWalletUIs: false,
            },
            defaultChain: base,
            supportedChains: [abstract, base, mainnet, ronin],
          }}
        >
          <PrivyAuthSync />
          {children}
        </PrivyProvider>
      </AuthProvider>
    </Providers>
  );
}
