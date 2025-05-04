'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { useRouter } from 'next/navigation';
import { Hex } from 'viem';

import { QueryProvider } from '@/providers';

import { getCreator, saveCreator } from './utils';

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
  const router = useRouter();

  return (
    <QueryProvider>
      <WithPortal>
        <NiceModal.Provider>
          <DynamicContextProvider
            settings={{
              environmentId:
                process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? '',
              walletConnectors: [EthereumWalletConnectors],
              events: {
                onAuthSuccess: (arguments_) => {
                  const twitchName = arguments_.user.verifiedCredentials.find(
                    (credential) => {
                      return credential.oauthProvider === 'twitch';
                    },
                  )?.oauthDisplayName;
                  const creator = getCreator(twitchName);
                  if (creator === undefined) {
                    const walletAddress = arguments_.user
                      .verifiedCredentials?.[0]?.address as Hex;
                    void saveCreator(walletAddress, twitchName);
                  } else {
                    router.push(`/creators/${twitchName}`);
                  }
                },
              },
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
