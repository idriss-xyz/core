'use client';
import NiceModal from '@ebay/nice-modal-react';
import { WithPortal } from '@idriss-xyz/ui/providers/with-portal';
import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import {
  DynamicContextProvider,
  getAuthToken,
} from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { useRouter } from 'next/navigation';
import { Hex } from 'viem';

import { QueryProvider } from '@/providers';

import { getCreatorProfile, saveCreatorProfile } from './utils';

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
                onAuthSuccess: async (arguments_) => {
                  const twitchCredential =
                    arguments_.user.verifiedCredentials.find((credential) => {
                      // Ignore due to missing direct enum type export from @dynamic-labs/sdk-react-core
                      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                      return credential.oauthProvider === 'twitch';
                    });
                  const twitchName = twitchCredential?.oauthUsername;
                  const creator = await getCreatorProfile(twitchName);
                  if (creator === undefined) {
                    const walletAddress = arguments_.user
                      .verifiedCredentials?.[0]?.address as Hex;
                    const dynamicJwtToken = getAuthToken();
                    await saveCreatorProfile(
                      walletAddress,
                      twitchName,
                      twitchCredential?.oauthDisplayName,
                      twitchCredential?.oauthAccountPhotos?.[0],
                      twitchCredential?.oauthAccountId,
                      arguments_.user.userId,
                      dynamicJwtToken,
                    );
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
      </WithPortal>
    </QueryProvider>
  );
};
