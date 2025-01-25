'use client';
import { WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { QueryProvider } from '@/providers';

import { wagmiconfig } from './config';

type Properties = {
  children: ReactNode;
};

export const Providers = ({ children }: Properties) => {
  return (
    <WagmiProvider config={wagmiconfig}>
      <QueryProvider>
        <WithPortal>
          <NiceModal.Provider>
            <WalletContextProvider>
              <RainbowKitProvider>{children}</RainbowKitProvider>
            </WalletContextProvider>
          </NiceModal.Provider>
        </WithPortal>
      </QueryProvider>
    </WagmiProvider>
  );
};
