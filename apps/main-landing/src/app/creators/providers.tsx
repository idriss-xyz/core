'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { TooltipProvider } from '@idriss-xyz/ui/tooltip';

import { QueryProvider } from '@/providers';

import { ToastProvider } from './context/toast-context';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  const [token, setToken] = useState<string | null>(null);
  const [loadingToken, setLoadingToken] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('custom-auth-token');
    setToken(t);
    setLoadingToken(false);
  }, []);

  const getCustomAuthToken = useCallback(() => {
    return Promise.resolve(token ?? undefined);
  }, [token]);

  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <TooltipProvider delayDuration={400}>
            <ToastProvider>
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
                    isLoading: loadingToken,
                  },
                  embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                  },
                }}
              >
                {children}
              </PrivyProvider>
            </ToastProvider>
          </TooltipProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
