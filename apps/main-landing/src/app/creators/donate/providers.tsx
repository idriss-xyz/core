'use client';
import { WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  return (
    <WithPortal>
      <NiceModal.Provider>
        <WalletContextProvider>
          <>{children}</>
        </WalletContextProvider>
      </NiceModal.Provider>
    </WithPortal>
  );
};
