'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { QueryProvider } from '@/providers';

import { PrivyAuthProvider } from '../context/privy-auth-context';

import { PrivyAuthWrapper } from './privy';

type Properties = {
  children: ReactNode;
};

const WalletContextProvider = dynamic(
  () => {
    return import('@idriss-xyz/wallet-connect').then((module) => {
      return module.WalletContextProvider;
    });
  },
  { ssr: false },
);

export const Providers = ({ children }: Properties) => {
  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <PrivyAuthProvider>
            <PrivyAuthWrapper>
              <WalletContextProvider>
                <>{children}</>
              </WalletContextProvider>
            </PrivyAuthWrapper>
          </PrivyAuthProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
