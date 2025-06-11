'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';

import { QueryProvider } from '@/providers';

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

const cssOverrides = `
  div:has(.social-redirect-view__container) {
    display: none;
  }
`;

export const Providers = ({ children }: Properties) => {
  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <DynamicContextProvider
            settings={{
              environmentId: process.env.DYNAMIC_ENVIRONMENT_ID ?? '',
              walletConnectors: [EthereumWalletConnectors],
              cssOverrides,
            }}
          >
            <WalletContextProvider>
              <>{children}</>
            </WalletContextProvider>
          </DynamicContextProvider>
        </NiceModal.Provider>
      </WithPortal>
    </QueryProvider>
  );
};
