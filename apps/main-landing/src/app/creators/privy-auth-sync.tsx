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
  const isAuthInProgress = useRef(false);
  const {
    customAuthToken,
    oauthLoading,
    setCreatorLoading,
    setCreator,
    isAuthenticated,
    isLoginModalOpen,
    setLoginError,
  } = useAuth();
  const { user, ready, getAccessToken, logout, authenticated } = usePrivy();
  const router = useRouter();
  const { createWallet } = useCreateWallet();

  const handleCreatorsAuth = useCallback(async () => {
    if (isAuthInProgress.current) return;

    isAuthInProgress.current = true;
    setCreatorLoading(true);
    try {
      const authToken = await getAccessToken();

      if (!user?.id) {
        throw new Error('Could not get user id.');
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
        if (!wallet) {
          wallet = await createWallet();
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
      console.error('Failed to authenticate creator.', error);
      setLoginError(true);
      if (authenticated) void logout();
      setCreator(null);
    } finally {
      setCreatorLoading(false);
      isAuthInProgress.current = false;
    }
  }, [
    user?.id,
    user?.wallet,
    router,
    authenticated,
    setCreator,
    setCreatorLoading,
    getAccessToken,
    logout,
    createWallet,
    setLoginError,
  ]);

  useEffect(() => {
    if (
      ready &&
      authenticated &&
      user &&
      !hasRunAuth.current &&
      isLoginModalOpen
    ) {
      hasRunAuth.current = true;
      void handleCreatorsAuth();
    }
  }, [ready, authenticated, user, isLoginModalOpen, handleCreatorsAuth]);

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading: oauthLoading,
    getExternalJwt: () => {
      return Promise.resolve(customAuthToken ?? undefined);
    },
    onError(error) {
      console.error('Error ocurred syncing:', error);
    },
  });

  return null;
}
