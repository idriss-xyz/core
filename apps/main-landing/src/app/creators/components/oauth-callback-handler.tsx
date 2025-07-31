'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { getCreatorProfile, saveCreatorProfile } from '../utils';
import { useAuth } from '../context/auth-context';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const { user, ready, authenticated, getAccessToken } = usePrivy();
  const { setCreator, creator, setCreatorLoading } = useAuth();

  useEffect(() => {
    if (!ready) {
      return;
    }

    const isTwitchLoginFlow = !!localStorage.getItem('twitch_new_user_info');

    if (!isTwitchLoginFlow) {
      return;
    }

    if (creator) {
      setCreatorLoading(false);
      return;
    }

    const handleAuth = async () => {
      setCreatorLoading(true);

      const twitchInfoRaw = localStorage.getItem('twitch_new_user_info');
      if (twitchInfoRaw) {
        localStorage.removeItem('twitch_new_user_info');
      }

      try {
        if (!user) {
          throw new Error('handleAuth called but user is not available.');
        }

        const walletAddress = user.wallet?.address as Hex | undefined;
        if (!walletAddress) {
          throw new Error('No wallet address found for authenticated user.');
        }
        const authToken = await getAccessToken();
        if (!authToken || !user.id) {
          throw new Error('Could not get auth token or user ID for new user.');
        }
        const existingCreator = await getCreatorProfile(authToken);

        if (existingCreator) {
          setCreator(existingCreator);
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
        console.error('Error handling auth callback:', error);
      } finally {
        setCreatorLoading(false);
      }
    };

    if (authenticated) {
      void handleAuth();
    } else {
      setCreator(null);
      setCreatorLoading(false);
    }
  }, [
    ready,
    authenticated,
    user,
    router,
    setCreator,
    creator,
    getAccessToken,
    setCreatorLoading,
  ]);
  return null;
}
