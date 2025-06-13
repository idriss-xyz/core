import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  useDynamicContext,
  useSocialAccounts,
  getAuthToken,
} from '@dynamic-labs/sdk-react-core';
import { ProviderEnum } from '@dynamic-labs/sdk-api-core';
import { Hex } from 'viem';

import { getCreatorProfile, saveCreatorProfile } from '../utils';
import { useAuth } from '../context/auth-context';

import { LoadingModal } from './login-modal';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const { user } = useDynamicContext();
  const { getLinkedAccountInformation } = useSocialAccounts();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setOauthError, setCreator } = useAuth();
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
            throw new Error('Could not get Twitch username');
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
            // TODO: receive response from saveCreatorProfile like below
            // const newCreator = await saveCreatorProfile(twitchName);
            const newCreator = await getCreatorProfile(twitchName);

            setCreator(newCreator!);
          } else if (creator) {
            setCreator(creator);
          }
          // Clean up URL parameters for next page load
          window.history.replaceState({}, document.title, '/creators');
          router.push('/creators/app');
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          setOauthError('Authentication failed. Please try again.');
          window.history.replaceState({}, document.title, '/creators');
        } finally {
          setIsProcessing(false);
        }
      }, 2000);
    }

    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
      setIsProcessing(false);
    };
  }, [
    searchParameters,
    user,
    router,
    getLinkedAccountInformation,
    setOauthError,
    setCreator,
  ]);

  return <LoadingModal isProcessing={isProcessing} />;
}
