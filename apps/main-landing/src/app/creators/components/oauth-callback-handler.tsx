'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../context/auth-context';

interface CallbackProperties {
  authToken: string | null;
  name: string | null;
  displayName: string | null;
  pfp: string | null;
  email: string | null;
  login: string | null;
  error: string | null;
}

export function OAuthCallbackHandler({
  authToken,
  name,
  displayName,
  pfp,
  email,
  login,
  error,
}: CallbackProperties) {
  const { setCustomAuthToken, setIsModalOpen, setOauthLoading, setOauthError } =
    useAuth();
  const router = useRouter();

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
