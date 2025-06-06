import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDynamicContext, useSocialAccounts } from '@dynamic-labs/sdk-react-core';
import { ProviderEnum } from '@dynamic-labs/types';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import { Hex } from 'viem';
import { getCreatorProfile, saveCreatorProfile } from '../utils';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useDynamicContext();
  const { getLinkedAccountInformation } = useSocialAccounts();

  useEffect(() => {
    const dynamicOauthCode = searchParams.get('dynamicOauthCode');
    const dynamicOauthState = searchParams.get('dynamicOauthState');

    // Only run this if we have OAuth parameters in the URL
    if (dynamicOauthCode && dynamicOauthState) {
      const handleCallback = async () => {
        try {
          const twitchAccount = getLinkedAccountInformation(ProviderEnum.Twitch);
          const twitchName = twitchAccount?.username;

          if (!twitchName) {
            console.error("Could not get Twitch username");
            return;
          }

          const creator = await getCreatorProfile(twitchName);

          if (creator === undefined) {
            const walletAddress = user?.verifiedCredentials?.[0]?.address as Hex;
            const dynamicJwtToken = getAuthToken();
            await saveCreatorProfile(
              walletAddress,
              twitchName,
              twitchAccount?.displayName,
              twitchAccount?.avatar,
              twitchAccount?.accountId,
              dynamicJwtToken,
            );
          }

          // Redirect to app
          router.push('/creators/app');
        } catch (error) {
          console.error("Error handling OAuth callback:", error);
        }
      };

      handleCallback();
    }
  }, [searchParams, user, router]);

  return null;
}
