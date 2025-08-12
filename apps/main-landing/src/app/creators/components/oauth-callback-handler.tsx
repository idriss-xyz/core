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
      setOauthLoading(false);
      setIsModalOpen(true);
      router.replace('/creators', { scroll: false });
    }

    if (error) {
      // Twitch could not authenticate the user
      setOauthLoading(false);
      console.error('Oauth error.', error);
      setOauthError(true);
    }

    if (authToken) {
      // Twitch has finished authenticating the user and succeeded
      setOauthLoading(false);
      setIsModalOpen(true);
      // Store Twitch info in localStorage to be picked up by the next page.
      if (name) {
        localStorage.setItem(
          'twitch_new_user_info',
          JSON.stringify({ name, displayName, pfp, email }),
        );
      }
      // Use the hook to pass the custom token to Privy
      setCustomAuthToken(authToken);
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
