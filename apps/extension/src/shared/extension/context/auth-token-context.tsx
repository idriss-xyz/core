'use client';

import { createContext, ReactNode, useCallback, useMemo } from 'react';

import { createContextHook } from 'shared/ui';

import { StoredAuthToken } from '../types';

type AuthTokenContextValue = {
  saveAuthToken: (payload: StoredAuthToken) => void;
  clearAuthToken: () => void;
  getAuthToken: () => Promise<StoredAuthToken>;
};

const AuthTokenContext = createContext<AuthTokenContextValue | undefined>(
  undefined,
);

export const AuthTokenContextProvider = ({
  children,
  onClearAuthToken,
  onGetAuthToken,
  onSaveAuthToken,
}: {
  children: ReactNode;
  onClearAuthToken?: () => void;
  onGetAuthToken?: () => Promise<StoredAuthToken>;
  onSaveAuthToken?: (payload: StoredAuthToken) => void;
}) => {
  const getAuthToken = useCallback(async () => {
    return onGetAuthToken?.();
  }, [onGetAuthToken]);

  const saveAuthToken = useCallback(
    (payload: StoredAuthToken) => {
      onSaveAuthToken?.(payload);
    },
    [onSaveAuthToken],
  );

  const clearAuthToken = useCallback(() => {
    onClearAuthToken?.();
  }, [onClearAuthToken]);

  const contextValue = useMemo(() => {
    return {
      getAuthToken,
      saveAuthToken,
      clearAuthToken,
    };
  }, [getAuthToken, saveAuthToken, clearAuthToken]);

  return (
    <AuthTokenContext.Provider value={contextValue}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = createContextHook(AuthTokenContext);
