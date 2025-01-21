'use client';
import { WalletContextProvider } from '@idriss-xyz/wallet-connect';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

import { QueryProvider } from '@/providers';

import { ClaimPageProvider } from './claim-page-context';
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
              <ClaimPageProvider>
                <RainbowKitProvider>{children}</RainbowKitProvider>
              </ClaimPageProvider>
            </WalletContextProvider>
          </NiceModal.Provider>
        </WithPortal>
      </QueryProvider>
    </WagmiProvider>
  );
};
