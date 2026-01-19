'use client';
import {
  useCreateWallet,
  usePrivy,
  useSubscribeToJwtAuthWithFlag,
} from '@privy-io/react-auth';
import { useCallback, useEffect, useRef } from 'react';
import { Hex } from 'viem';
import { useRouter } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';

import {
  getCreatorProfile,
  saveCreatorProfile,
  editCreatorProfile,
  isHomeCallback,
} from './utils';
import { useAuth } from './context/auth-context';
import { deleteCookie, getCookie } from './cookies';

export function PrivyAuthSync() {
  const hasRunAuth = useRef(false);
  const isAuthInProgress = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    customAuthToken,
    oauthLoading,
    setCreatorLoading,
    setCreator,
    isAuthenticated,
    isLoginModalOpen,
    setLoginError,
    callbackUrl,
    setDonor,
    setDonorLoading,
  } = useAuth();

  // Use ref to ensure getExternalJwt always has the latest token value
  const customAuthTokenRef = useRef(customAuthToken);
  customAuthTokenRef.current = customAuthToken;
  const { user, ready, getAccessToken, logout, authenticated } = usePrivy();
  const router = useRouter();
  const { createWallet } = useCreateWallet();

  const handleCreatorsAuth = useCallback(async () => {
    if (isAuthInProgress.current) {
      console.log(
        '[PrivyAuthSync] handleCreatorsAuth already in progress, skipping',
      );
      return;
    }

    console.log('[PrivyAuthSync] handleCreatorsAuth starting');
    isAuthInProgress.current = true;
    setCreatorLoading(true);
    setDonorLoading(true);
    try {
      console.log('[PrivyAuthSync] Getting access token from Privy');
      const authToken = await getAccessToken();
      console.log('[PrivyAuthSync] Got access token:', !!authToken);

      if (!user?.id) {
        throw new Error('Could not get user id.');
      }

      if (!authToken) {
        throw new Error('Could not get auth token for new user.');
      }

      console.log('[PrivyAuthSync] Fetching existing creator profile');
      const existingCreator = await getCreatorProfile(authToken);

      if (existingCreator) {
        console.log(
          '[PrivyAuthSync] Existing creator found:',
          existingCreator.name,
        );
        setCreator(existingCreator);
        deleteCookie('referrerName');
        deleteCookie('referrerAddress');
        deleteCookie('referrerProfilePictureUrl');
        if (callbackUrl && !isHomeCallback(callbackUrl)) {
          console.log(
            '[PrivyAuthSync] Has callback URL (not home), will redirect',
          );
          // If existing creator has isDonor true, update it to false
          if (existingCreator.isDonor) {
            await editCreatorProfile(
              existingCreator.name,
              { isDonor: false },
              authToken,
            );
          }
          const updatedCreator = await getCreatorProfile(authToken);
          setCreator(updatedCreator ?? existingCreator);
          setDonor(updatedCreator ?? existingCreator);
          router.replace(callbackUrl);
        } else if (existingCreator.doneSetup) {
          console.log(
            '[PrivyAuthSync] Setup done, redirecting to /app/earnings/stats-and-history',
          );
          router.replace('/app/earnings/stats-and-history');
        } else {
          console.log(
            '[PrivyAuthSync] Setup not done, redirecting to /app/setup/payment-methods',
          );
          router.replace('/app/setup/payment-methods');
        }
      } else {
        console.log(
          '[PrivyAuthSync] No existing creator, creating new profile',
        );
        let newCreatorName: string;
        let newCreatorDisplayName: string | null = null;
        let newCreatorProfilePic: string | null = null;
        let newCreatorEmail: string | null = null;
        let isDonor = false;
        // set isDonor when callback is not the normal app landing signup
        // (ex. a donate page like "/daniel0ar")
        if (callbackUrl && !isHomeCallback(callbackUrl)) {
          isDonor = true;
        }

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

        const referrerAddress =
          typeof window === 'undefined' ? null : getCookie('referrerAddress');

        await saveCreatorProfile(
          wallet.address as Hex,
          newCreatorName,
          newCreatorDisplayName,
          newCreatorProfilePic,
          newCreatorEmail,
          user.id,
          authToken,
          isDonor,
          referrerAddress,
        );

        const newCreator = await getCreatorProfile(authToken);

        if (!newCreator) {
          throw new Error('Failed to fetch newly created profile.');
        }

        sendGAEvent('event', 'signup_completed', { value: 1 });
        setCreator(newCreator);
        deleteCookie('referrerName');
        deleteCookie('referrerAddress');
        deleteCookie('referrerProfilePictureUrl');
        if (callbackUrl && !isHomeCallback(callbackUrl)) {
          setDonor(newCreator);
          setDonorLoading(false);
          router.replace(callbackUrl);
        } else {
          router.replace('/app/setup/payment-methods');
        }
      }
    } catch (error) {
      console.error('Failed to authenticate creator.', error);
      setLoginError(true);
      if (authenticated) void logout();
      setCreator(null);
      setDonor(null);
    } finally {
      setCreatorLoading(false);
      setDonorLoading(false);
      isAuthInProgress.current = false;
    }
  }, [
    user?.id,
    user?.wallet,
    router,
    authenticated,
    callbackUrl,
    setCreator,
    setDonor,
    setCreatorLoading,
    setDonorLoading,
    getAccessToken,
    logout,
    createWallet,
    setLoginError,
  ]);

  // Fallback: if we have customAuthToken but Privy hasn't authenticated after 10 seconds, force auth
  useEffect(() => {
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    // Only set timeout if we're waiting for Privy authentication
    if (
      customAuthToken &&
      ready &&
      !authenticated &&
      user &&
      !hasRunAuth.current &&
      isLoginModalOpen
    ) {
      console.log(
        '[PrivyAuthSync] Privy not authenticated yet, setting 10s fallback timeout',
      );
      retryTimeoutRef.current = setTimeout(() => {
        console.log(
          '[PrivyAuthSync] Fallback timeout triggered - forcing auth despite Privy not being authenticated',
        );
        if (!hasRunAuth.current) {
          hasRunAuth.current = true;
          void handleCreatorsAuth();
        }
      }, 10_000); // 10 seconds
    }

    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
    };
  }, [
    customAuthToken,
    ready,
    authenticated,
    user,
    isLoginModalOpen,
    handleCreatorsAuth,
  ]);

  useEffect(() => {
    console.log('[PrivyAuthSync] useEffect triggered with conditions:', {
      ready,
      authenticated,
      hasUser: !!user,
      hasRunAuth: hasRunAuth.current,
      isLoginModalOpen,
      allConditionsMet:
        ready &&
        authenticated &&
        user &&
        !hasRunAuth.current &&
        isLoginModalOpen,
    });

    if (
      ready &&
      authenticated &&
      user &&
      !hasRunAuth.current &&
      isLoginModalOpen
    ) {
      console.log(
        '[PrivyAuthSync] All conditions met, calling handleCreatorsAuth',
      );
      hasRunAuth.current = true;
      // Clear fallback timeout since we're proceeding normally
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      void handleCreatorsAuth();
    } else {
      console.log('[PrivyAuthSync] Conditions not met, waiting...');
    }
  }, [ready, authenticated, user, isLoginModalOpen, handleCreatorsAuth]);

  useEffect(() => {
    console.log('[PrivyAuthSync] Dependency changed:', {
      hasCustomAuthToken: !!customAuthToken,
      tokenLength: customAuthToken?.length,
      isAuthenticated,
      oauthLoading,
      timestamp: Date.now(),
    });
  }, [customAuthToken, isAuthenticated, oauthLoading]);

  console.log('[PrivyAuthSync] Calling useSubscribeToJwtAuthWithFlag with:', {
    isAuthenticated,
    isLoading: oauthLoading,
    hasCustomAuthToken: !!customAuthToken,
    tokenLength: customAuthToken?.length,
  });

  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading: oauthLoading,
    getExternalJwt: () => {
      // Read from ref to get the latest value, not the closure value
      const currentToken = customAuthTokenRef.current;
      const tokenToReturn = currentToken ?? undefined;
      console.log('[PrivyAuthSync] getExternalJwt INVOKED:', {
        hasCustomAuthToken: !!currentToken,
        tokenLength: currentToken?.length,
        returningUndefined: tokenToReturn === undefined,
        isAuthenticated,
        oauthLoading,
        timestamp: Date.now(),
      });
      return Promise.resolve(tokenToReturn);
    },
    onError(error) {
      console.error('[PrivyAuthSync] Error occurred syncing:', error);
      // Clear invalid token and force re-login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('custom-auth-token');
      }
      setLoginError(true);
      setCreator(null);
      setDonor(null);
    },
  });

  return null;
}
