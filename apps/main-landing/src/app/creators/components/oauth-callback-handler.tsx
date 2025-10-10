'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/auth-context';

export function OAuthCallbackHandler() {
  const {
    loading,
    setCustomAuthToken,
    setIsModalOpen,
    setIsDonateOptionsModalOpen,
    setOauthError,
    setCallbackUrl,
    setIsLoading,
  } = useAuth();
  const router = useRouter();
  const searchParameters = useSearchParams();
  const {
    token: authToken,
    name,
    displayName,
    pfp,
    email,
    login,
    error,
    callbackUrl,
  } = Object.fromEntries(
    [
      'token',
      'name',
      'displayName',
      'pfp',
      'email',
      'login',
      'error',
      'callbackUrl',
    ].map((k) => {
      return [k, searchParameters.get(k)];
    }),
  );
  const hasSetAuthTokenReference = useRef(false);

  useEffect(() => {
    if (login) {
      // Twitch has finished authenticating the user and failed
      setIsModalOpen(true);
      router.replace('/creators', { scroll: false });
    } else if (error) {
      // Twitch could not authenticate the user
      console.error('Oauth error.', error);
      setIsModalOpen(true);
      setOauthError(true);
    }
  }, [login, router, error, setIsModalOpen, setOauthError]);

  // Separate effect to set authToken once
  useEffect(() => {
    if (authToken && !hasSetAuthTokenReference.current) {
      // Twitch has finished authenticating the user and succeeded
      setIsModalOpen(true);
      setIsDonateOptionsModalOpen(true);
      if (!loading) {
        setIsLoading(true);
      }
      if (name) {
        localStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      if (callbackUrl) setCallbackUrl(callbackUrl);
      setCustomAuthToken(authToken);
      hasSetAuthTokenReference.current = true;
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, loading]);

  return null;
}
