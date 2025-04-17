'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';

import { QueryProvider } from '@/providers';

import {
  DynamicContextProvider,
} from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

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
          <DynamicContextProvider
            settings={{
              environmentId: process.env.DYNAMIC_ENVIRONMENT_ID ?? '',
              walletConnectors: [EthereumWalletConnectors],
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
