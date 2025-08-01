'use client';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';

import { useAuth } from '../context/auth-context';

interface CallbackProperties {
  authToken: string | null;
}

export function OAuthCallbackHandler({ authToken }: CallbackProperties) {
  const { handleCreatorsAuth } = useAuth();
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    if (ready && authenticated && authToken != null) {
      void handleCreatorsAuth();
    }
    return;
  }, [ready, authenticated, authToken, handleCreatorsAuth]);

  return null;
}
