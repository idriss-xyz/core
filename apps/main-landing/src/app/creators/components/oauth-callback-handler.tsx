import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useDynamicContext,
  useSocialAccounts,
  getAuthToken,
} from '@dynamic-labs/sdk-react-core';
import { ProviderEnum } from '@dynamic-labs/types';
import { Hex } from 'viem';

import { getCreatorProfile, saveCreatorProfile } from '../utils';

import { LoadingModal } from './login-modal';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const { user } = useDynamicContext();
  const { getLinkedAccountInformation } = useSocialAccounts();
  const [isProcessing, setIsProcessing] = useState(false);
  // Timeout adds small delay to wait for auth to finish
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const dynamicOauthCode = searchParameters.get('dynamicOauthCode');
    const dynamicOauthState = searchParameters.get('dynamicOauthState');

    // Only run this if we have OAuth parameters in the URL
    if (dynamicOauthCode && dynamicOauthState) {
      setIsProcessing(true);

      // Clear any existing timeout
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }

      timeoutReference.current = setTimeout(async () => {
        try {
          const twitchAccount = getLinkedAccountInformation(
            ProviderEnum.Twitch,
          );
          const twitchName = twitchAccount?.username;

          if (!twitchName) {
            console.error('Could not get Twitch username');
            return;
          }

          const creator = await getCreatorProfile(twitchName);

          if (creator === undefined) {
            const walletAddress = user?.verifiedCredentials?.[0]
              ?.address as Hex;
            const dynamicJwtToken = getAuthToken();
            await saveCreatorProfile(
              walletAddress,
              twitchName,
              twitchAccount?.displayName,
              twitchAccount?.avatar,
              user?.userId,
              dynamicJwtToken,
            );
          }

          // Clean up URL parameters (Check if needed)
          window.history.replaceState({}, document.title, '/creators');

          router.push('/creators/app');
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
        }
      }, 1500);
    }

    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
      setIsProcessing(false);
    };
  }, [searchParameters, user, router, getLinkedAccountInformation]);
  return <LoadingModal isProcessing={isProcessing} />;
}
