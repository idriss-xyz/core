'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useAuth } from '../context/auth-context';

export function OAuthCallbackHandler() {
  const { setCustomAuthToken, setIsModalOpen, setOauthLoading, setOauthError } =
    useAuth();
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
  } = Object.fromEntries(
    ['token', 'name', 'displayName', 'pfp', 'email', 'login', 'error'].map(
      (k) => {
        return [k, searchParameters.get(k)];
      },
    ),
  );

  useEffect(() => {
    if (login) {
      // Twitch has finished authenticating the user and failed
      setIsModalOpen(true);
      router.replace('/creators', { scroll: false });
    } else if (error) {
      // Twitch could not authenticate the user
      console.error('Oauth error.', error);
      setOauthError(true);
    } else if (authToken) {
      // Twitch has finished authenticating the user and succeeded
      setIsModalOpen(true);
      if (name) {
        localStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      setCustomAuthToken(authToken);
    }
    if (login || error || authToken) {
      setOauthLoading(false);
    }
  }, [
    authToken,
    name,
    displayName,
    pfp,
    email,
    login,
    router,
    error,
    setIsModalOpen,
    setOauthLoading,
    setCustomAuthToken,
    setOauthError,
  ]);

  return null;
}
