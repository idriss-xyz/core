'use client';
import { WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';

import { QueryProvider } from '@/providers';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <WalletContextProvider>
            <>{children}</>
          </WalletContextProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
