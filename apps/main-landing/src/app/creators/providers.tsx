'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { useRouter } from 'next/navigation';
import { Hex } from 'viem';
import { WagmiProvider } from 'wagmi';

import { QueryProvider } from '@/providers';

import { getCreatorProfile, saveCreatorProfile } from './utils';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiconfig } from './donate/config';

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
    <WagmiProvider config={wagmiconfig}>
      <QueryProvider>
        <WithPortal>
          <RainbowKitProvider>
            <NiceModal.Provider>
              <DynamicContextProvider
                settings={{
                  environmentId:
                    process.env.NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID ?? '',
                  walletConnectors: [EthereumWalletConnectors],
                  events: {
                    onAuthSuccess: async (arguments_) => {
                      const twitchName = arguments_.user.verifiedCredentials.find(
                        (credential) => {
                          return credential.oauthProvider === 'twitch';
                        },
                      )?.oauthUsername;
                      const creator = await getCreatorProfile(twitchName);
                      if (creator === undefined) {
                        const walletAddress = arguments_.user
                          .verifiedCredentials?.[0]?.address as Hex;
                        await saveCreatorProfile(walletAddress, twitchName);
                      }
                      router.push(`/creators/app`);
                    },
                  },
                }}
              >
                <WalletContextProvider>
                  <>{children}</>
                </WalletContextProvider>
              </DynamicContextProvider>
            </NiceModal.Provider>
          </RainbowKitProvider>
        </WithPortal>
      </QueryProvider>
    </WagmiProvider>
  );
};
