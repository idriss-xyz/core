'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePrivy } from '@privy-io/react-auth';
import { Hex } from 'viem';

import { getCreatorProfile, saveCreatorProfile } from '../utils';
import { useAuth } from '../context/auth-context';

export function OAuthCallbackHandler() {
  const router = useRouter();
  const { user, ready, authenticated, getAccessToken } = usePrivy();
  const { setCreator, creator, setCreatorLoading } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // This effect will now correctly wait for the authenticated state to be true.
    // It will re-run when `authenticated` changes from false to true.
    if (!ready) {
      // Still waiting for Privy to initialize.
      return;
    }

    if (!authenticated) {
      // User is not logged in yet, do nothing.
      setCreator(null);
      // todo: check bug when not authed
      // setCreatorLoading(false);
      return;
    }

    if (authChecked || creator) {
      // We have already processed the login or have a creator object.
      return;
    }

    const handleAuth = async () => {
      setAuthChecked(true);
      setCreatorLoading(true);

      try {
        if (!user) {
          throw new Error('handleAuth called but user is not available.');
        }

        const walletAddress = user.wallet?.address as Hex | undefined;
        if (!walletAddress) {
          throw new Error('No wallet address found for authenticated user.');
        }

        const existingCreator = await getCreatorProfile(
          undefined,
          walletAddress,
        );

        if (existingCreator) {
          setCreator(existingCreator);
        } else {
          // NEW USER ONBOARDING LOGIC
          const authToken = await getAccessToken();
          if (!authToken || !user.id) {
            throw new Error(
              'Could not get auth token or user ID for new user.',
            );
          }

          let newCreatorName: string;
          let newCreatorDisplayName: string | null = null;
          let newCreatorProfilePic: string | null = null;
          let newCreatorEmail: string | null = null;

          // Check if we have Twitch info from the custom login flow
          const twitchInfoRaw = sessionStorage.getItem('twitch_new_user_info');
          if (twitchInfoRaw) {
            const twitchInfo = JSON.parse(twitchInfoRaw);
            newCreatorName = twitchInfo.name;
            newCreatorDisplayName = twitchInfo.displayName;
            newCreatorProfilePic = twitchInfo.pfp;
            newCreatorEmail = twitchInfo.email;
            sessionStorage.removeItem('twitch_new_user_info'); // Clean up
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

          const newCreator = await getCreatorProfile(newCreatorName);
          if (!newCreator) {
            throw new Error('Failed to fetch newly created profile.');
          }

          setCreator(newCreator);
        }
      } catch (error) {
        console.error('Error handling auth callback:', error);
      } finally {
        setCreatorLoading(false);
      }
    };

    void handleAuth();
  }, [
    ready,
    authenticated,
    user,
    router,
    setCreator,
    authChecked,
    creator,
    getAccessToken,
    setCreatorLoading,
  ]);
  return null;
}
