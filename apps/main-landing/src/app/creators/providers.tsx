'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode, useCallback } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';

import { QueryProvider } from '@/providers';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  const getCustomAuthToken = useCallback(() => {
    // This function looks for the token from our custom Twitch flow
    const token = sessionStorage.getItem('custom-auth-token');
    // The Privy SDK expects a Promise that resolves to a string or undefined.
    // sessionStorage.getItem returns a string or null. We convert null to undefined.
    return Promise.resolve(token ?? undefined);
  }, []);

  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <PrivyProvider
            appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? ''}
            config={{
              appearance: {
                theme: 'light',
                accentColor: '#000000',
                showWalletLoginFirst: true,
              },
              // This handles the custom Twitch login flow
              customAuth: {
                getCustomAccessToken: getCustomAuthToken,
                isLoading: false,
              },
              // This handles the standard Email and Wallet login modal
              loginMethods: ['email', 'wallet'],
              embeddedWallets: {
                createOnLogin: 'users-without-wallets',
              },
            }}
          >
            {children}
          </PrivyProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
