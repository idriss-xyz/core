'use client';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';

import { QueryProvider } from '@/providers';

import { wagmiconfig } from './config';

type Properties = {
  children: ReactNode;
};

export const RainbowKitProviders = ({ children }: Properties) => {
  return (
    <WagmiProvider config={wagmiconfig}>
      <QueryProvider>
        <WithPortal>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </WithPortal>
      </QueryProvider>
    </WagmiProvider>
  );
};
