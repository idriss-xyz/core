'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/auth-context';

export function OAuthCallbackHandler() {
  const {
    oauthLoading,
    loading,
    setCustomAuthToken,
    setIsModalOpen,
    setIsDonateOptionsModalOpen,
    setOauthLoading,
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
      if (!oauthLoading) {
        setOauthLoading(false);
      }
    }
  }, [
    name,
    displayName,
    pfp,
    email,
    login,
    router,
    error,
    callbackUrl,
    loading,
    oauthLoading,
    setIsModalOpen,
    setOauthLoading,
    setCustomAuthToken,
    setOauthError,
    setCallbackUrl,
    setIsLoading,
  ]);

  // Separate effect to set authToken once
  useEffect(() => {
    if (authToken) {
      // Twitch has finished authenticating the user and succeeded
      setIsModalOpen(true);
      setIsDonateOptionsModalOpen(true);
      if (name) {
        localStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      if (callbackUrl) setCallbackUrl(callbackUrl);
      setCustomAuthToken(authToken);
      if (!loading) {
        setOauthLoading(false);
        setIsLoading(true);
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, loading]);

  return null;
}
