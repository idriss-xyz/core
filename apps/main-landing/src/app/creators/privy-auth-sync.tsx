'use client';
import {
  useCreateWallet,
  usePrivy,
  useSubscribeToJwtAuthWithFlag,
} from '@privy-io/react-auth';
import { useCallback, useEffect, useRef } from 'react';
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';

import { getCreatorProfile, saveCreatorProfile } from './utils';
import { useAuth } from './context/auth-context';

export function PrivyAuthSync() {
  const hasRunAuth = useRef(false);
  const {
    customAuthToken,
    oauthLoading,
    setCreatorLoading,
    setCreator,
    isAuthenticated,
  } = useAuth();
  const { user, ready, getAccessToken, logout, authenticated } = usePrivy();
  const router = useRouter();
  const { createWallet } = useCreateWallet();

  const handleCreatorsAuth = useCallback(async () => {
    setCreatorLoading(true);
    console.log('Authorizing on creators...');
    try {
      const authToken = await getAccessToken();
      console.log('authToken:', authToken);
      console.log('customAuthToken:', customAuthToken);
      console.log('user:', user);
      console.log('oauthLoading:', oauthLoading);
      console.log('ready:', ready);
      console.log('privy authenticated:', authenticated);
      console.log('twitch authenticated:', isAuthenticated);

      if (!user) {
        throw new Error('handleAuth called but user is not available.');
      }

      if (!authToken) {
        throw new Error('Could not get auth token for new user.');
      }

      const existingCreator = await getCreatorProfile(authToken);

      if (existingCreator) {
        setCreator(existingCreator);
        setCreatorLoading(false);
        if (existingCreator.doneSetup) {
          router.replace('/creators/app/earnings/stats-and-history');
        } else {
          router.replace('/creators/app/setup/payment-methods');
        }
      } else {
        let newCreatorName: string;
        let newCreatorDisplayName: string | null = null;
        let newCreatorProfilePic: string | null = null;
        let newCreatorEmail: string | null = null;

        const twitchInfoRaw = localStorage.getItem('twitch_new_user_info');

        // Check if we have Twitch info from the custom login flow
        if (twitchInfoRaw) {
          const twitchInfo = JSON.parse(twitchInfoRaw);
          newCreatorName = twitchInfo.name;
          newCreatorDisplayName = twitchInfo.displayName;
          newCreatorProfilePic = twitchInfo.pfp;
          newCreatorEmail = twitchInfo.email;
        } else {
          // User logged in with email or wallet, generate a random name
          // newCreatorName = `user-${user.id.slice(-8)}`;
          // newCreatorDisplayName = newCreatorName;
          throw new Error('Unsupported login method');
        }
        // Create an embedded wallet for the creator
        let wallet = user.wallet;
        if (!wallet){
          wallet = await createWallet();
          console.log('newCreatorwallet:', wallet);
        }

        await saveCreatorProfile(
          wallet.address as Hex,
          newCreatorName,
          newCreatorDisplayName,
          newCreatorProfilePic,
          newCreatorEmail,
          user.id,
          authToken,
        );

        const newCreator = await getCreatorProfile(authToken);

        if (!newCreator) {
          throw new Error('Failed to fetch newly created profile.');
        }

        setCreator(newCreator);
        router.replace('/creators/app/setup/payment-methods');
      }
    } catch (error) {
      console.error('Failed to authenticate creator:', error);
      if (authenticated) void logout();
      // TODO: Check if we need to remove localstorage twitch_new_user_info here
      setCreator(null);
    } finally {
      setCreatorLoading(false);
    }
  }, [
    user,
    router,
    authenticated,
    customAuthToken,
    isAuthenticated,
    oauthLoading,
    ready,
    setCreator,
    setCreatorLoading,
    getAccessToken,
    logout,
    createWallet,
  ]);

  useEffect(() => {
    if (ready && authenticated && user && !hasRunAuth.current) {
      hasRunAuth.current = true;
      handleCreatorsAuth();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, authenticated, user])

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading: oauthLoading,
    getExternalJwt: () => {
      console.log('Getting external jwt: ', customAuthToken)
      return Promise.resolve(customAuthToken ?? undefined);
    },
    onError(error) {
      console.error('Error ocurred syncing: ', error);
    },
  });

  return null;
}
