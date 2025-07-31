'use client';
import { useSubscribeToJwtAuthWithFlag } from '@privy-io/react-auth';
import { useCallback, useEffect, useState } from 'react';

export function PrivyAuthSync() {
  // 1) local state for the token
  const [token, setToken] = useState<string | undefined>();

  // 2) on mount, read from sessionStorage exactly once
  useEffect(() => {
    const t = localStorage.getItem('custom-auth-token') ?? undefined;
    setToken(t);
  }, []);

  const isLoading = token === undefined; // still reading
  const isAuthenticated = Boolean(token); // have a token?

  const getExternalJwt = useCallback((): Promise<string | undefined> => {
    return Promise.resolve(token ?? undefined);
  }, [token]);

  // 5) sync into Privy
  useSubscribeToJwtAuthWithFlag({
    isAuthenticated,
    isLoading,
    getExternalJwt,
  });

  return null;
}
