'use client';
import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CREATOR_API_URL } from '@idriss-xyz/constants';

import { useAuth } from '../context/auth-context';

interface TokenExchangeResponse {
  token: string;
  name: string;
  displayName: string;
  pfp: string;
  email: string;
  callbackUrl: string;
}

export function OAuthCallbackHandler() {
  const {
    oauthLoading,
    loading,
    setCustomAuthToken,
    setIsModalOpen,
    setOauthLoading,
    setOauthError,
    setCallbackUrl,
    setIsLoading,
  } = useAuth();
  const router = useRouter();
  const searchParameters = useSearchParams();
  const hasExchangedCode = useRef(false);

  const { code, login, error, callbackUrl } = Object.fromEntries(
    ['code', 'login', 'error', 'callbackUrl'].map((k) => {
      return [k, searchParameters.get(k)];
    }),
  );

  useEffect(() => {
    const exchangeCodeForToken = async (authCode: string) => {
      if (hasExchangedCode.current) return;
      hasExchangedCode.current = true;

      try {
        const response = await fetch(`${CREATOR_API_URL}/auth/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code: authCode }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange authorization code');
        }

        const data: TokenExchangeResponse = await response.json();

        setIsModalOpen(true);
        if (data.name) {
          localStorage.setItem(
            'twitch_new_user_info',
            JSON.stringify({
              name: data.name,
              displayName: data.displayName,
              pfp: data.pfp,
              email: data.email,
            }),
          );
        }
        if (data.callbackUrl) setCallbackUrl(data.callbackUrl);
        setCustomAuthToken(data.token);
        setOauthLoading(false);
        setIsLoading(true);
      } catch (error_) {
        console.error('Failed to exchange code for token:', error_);
        setIsModalOpen(true);
        setOauthError(true);
        setOauthLoading(false);
        hasExchangedCode.current = false;
      }
    };

    if (login) {
      // Twitch has finished authenticating the user and failed
      setIsModalOpen(true);
      router.replace('/', { scroll: false });
    } else if (error) {
      // Twitch could not authenticate the user
      console.error('Oauth error.', error);
      setIsModalOpen(true);
      setOauthError(true);
      if (!oauthLoading) {
        setOauthLoading(false);
      }
    } else if (code) {
      // Exchange the authorization code for a token
      void exchangeCodeForToken(code);
    }
  }, [
    code,
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

  return null;
}
