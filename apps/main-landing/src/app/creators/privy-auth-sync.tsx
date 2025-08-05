'use client';
import { usePrivy, useSubscribeToJwtAuthWithFlag } from '@privy-io/react-auth';
import { useCallback } from 'react';
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';

import { getCreatorProfile, saveCreatorProfile } from './utils';
import { useAuth } from './context/auth-context';

export function PrivyAuthSync() {
  const { customAuthToken, oauthLoading, creatorLoading, setCreatorLoading, setCreator } =
    useAuth();
  const { user, getAccessToken, logout, authenticated } = usePrivy();
  const router = useRouter();

  const handleCreatorsAuth = useCallback(async () => {
    setCreatorLoading(true);
    console.log('Authorizing on creators...');
    try {
      const authToken = await getAccessToken();
      if (!user) {
        throw new Error('handleAuth called but user is not available.');
      }

      const walletAddress = user?.wallet?.address as Hex; // TODO: Crete wallet here manually with Privy hook

      if (!authToken || !user.id) {
        throw new Error('Could not get auth token or user ID for new user.');
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
        // NEW USER ONBOARDING LOGIC
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
        await saveCreatorProfile(
          walletAddress,
          newCreatorName,
          newCreatorDisplayName,
          newCreatorProfilePic,
          newCreatorEmail,
          user.id, // This is the Privy ID
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
    setCreator,
    setCreatorLoading,
    getAccessToken,
    logout,
  ]);

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated: !!customAuthToken,
    isLoading: creatorLoading || oauthLoading,
    getExternalJwt: () => {
      return Promise.resolve(customAuthToken ?? undefined);
    },
    onAuthenticated: handleCreatorsAuth,
  });

  return null;
}
