'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { createContextHook } from 'shared/ui';

import { StoredAuthToken } from '../types';

type AuthTokenContextValue = {
  authToken?: StoredAuthToken;
  saveAuthToken: (payload: StoredAuthToken) => void;
  clearAuthToken: () => void;
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
  const [authToken, setAuthToken] = useState<StoredAuthToken>();

  useEffect(() => {
    const fetchAuthToken = async () => {
      const token = await onGetAuthToken?.();
      setAuthToken(token);
    };

    void fetchAuthToken();
  }, [onGetAuthToken]);

  const saveAuthToken = useCallback(
    (payload: StoredAuthToken) => {
      onSaveAuthToken?.(payload);
      setAuthToken(payload);
    },
    [onSaveAuthToken],
  );

  const clearAuthToken = useCallback(() => {
    onClearAuthToken?.();
    setAuthToken(undefined);
  }, [onClearAuthToken]);

  const contextValue = useMemo(() => {
    return {
      authToken,
      saveAuthToken,
      clearAuthToken,
    };
  }, [authToken, saveAuthToken, clearAuthToken]);

  return (
    <AuthTokenContext.Provider value={contextValue}>
      {children}
    </AuthTokenContext.Provider>
  );
};

export const useAuthToken = createContextHook(AuthTokenContext);
