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
                  const credentials = arguments_.user.verifiedCredentials;

                  const findCredentialByFormat = (format: string) =>
                    // Ignore due to missing direct enum type export from @dynamic-labs/sdk-react-core
                    {
                      return credentials.find((c) => {
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                        return c.format === format;
                      });
                    };
                  const blockchainCredential =
                    findCredentialByFormat('blockchain');
                  const oauthCredential = findCredentialByFormat('oauth');
                  const emailCredential = findCredentialByFormat('email');

                  // Ignore due to missing direct enum type export from @dynamic-labs/sdk-react-core
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
                  if (oauthCredential?.oauthProvider === 'twitch') {
                    const twitchUsername = oauthCredential.oauthUsername;
                    if (!twitchUsername) return;

                    const creator = await getCreatorProfile(twitchUsername);
                    if (!creator && blockchainCredential?.address) {
                      await saveCreatorProfile(
                        blockchainCredential.address as Hex,
                        twitchUsername,
                      );
                    }
                  }

                  // Handle email login
                  else if (emailCredential?.email) {
                    const name = `u-${arguments_.user.userId?.slice(0, 4)}`;
                    const creator = await getCreatorProfile(name);

                    if (!creator && blockchainCredential?.address) {
                      await saveCreatorProfile(
                        blockchainCredential.address as Hex,
                        name,
                      );
                    }
                  } else {
                    // TODO: handle wallet login
                  }
                  return router.push('/creators/app');
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
