'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import dynamic from 'next/dynamic';

import { QueryProvider } from '@/providers';

import { wagmiconfig } from './config';

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
