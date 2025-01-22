'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';

import { createContextHook } from 'shared/ui';
import { onWindowMessage } from 'shared/messaging';

import {
  StoredAuthToken,
  StoredSubscriptionsAmount,
  StoredToastSoundState,
} from '../types';

type TradingCopilotContextValue = {
  saveAuthToken: (payload: StoredAuthToken) => void;
  clearAuthToken: () => void;
  getAuthToken: () => Promise<StoredAuthToken>;
  saveToastSoundState: (payload: StoredToastSoundState) => void;
  clearToastSoundState: () => void;
  toastSoundEnabled: StoredToastSoundState;
  saveSubscriptionsAmount: (payload: StoredSubscriptionsAmount) => void;
  clearSubscriptionsAmount: () => void;
};

const TradingCopilotContext = createContext<
  TradingCopilotContextValue | undefined
>(undefined);

export const TradingCopilotContextProvider = ({
  children,
  onClearAuthToken,
  onGetAuthToken,
  onSaveAuthToken,
  onClearToastSoundState,
  onGetToastSoundState,
  onSaveToastSoundState,
  onClearSubscriptionsAmount,
  onSaveSubscriptionsAmount,
}: {
  children: ReactNode;
  onClearAuthToken?: () => void;
  onGetAuthToken?: () => Promise<StoredAuthToken>;
  onSaveAuthToken?: (payload: StoredAuthToken) => void;
  onClearToastSoundState?: () => void;
  onGetToastSoundState?: () => Promise<StoredToastSoundState>;
  onSaveToastSoundState?: (payload: StoredToastSoundState) => void;
  onClearSubscriptionsAmount?: () => void;
  onSaveSubscriptionsAmount?: (payload: StoredSubscriptionsAmount) => void;
}) => {
  const [toastSoundEnabled, setToastSoundEnabled] =
    useState<StoredToastSoundState>();
  const [tabChangedListenerInitialized, setTabChangedListenerInitialized] =
    useState(false);

  if (!tabChangedListenerInitialized) {
    onWindowMessage('TAB_CHANGED', async () => {
      const latestToastSoundState = await onGetToastSoundState?.();

      if (latestToastSoundState === undefined) {
        return;
      }

      setToastSoundEnabled(latestToastSoundState);
    });
    setTabChangedListenerInitialized(true);
  }

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

  const saveToastSoundState = useCallback(
    (payload: StoredToastSoundState) => {
      setToastSoundEnabled(payload);
      onSaveToastSoundState?.(payload);
    },
    [onSaveToastSoundState],
  );

  const clearToastSoundState = useCallback(() => {
    onClearToastSoundState?.();
  }, [onClearToastSoundState]);

  const saveSubscriptionsAmount = useCallback(
    (payload: StoredSubscriptionsAmount) => {
      onSaveSubscriptionsAmount?.(payload);
    },
    [onSaveSubscriptionsAmount],
  );

  const clearSubscriptionsAmount = useCallback(() => {
    onClearSubscriptionsAmount?.();
  }, [onClearSubscriptionsAmount]);

  const contextValue = useMemo(() => {
    return {
      getAuthToken,
      saveAuthToken,
      clearAuthToken,
      toastSoundEnabled,
      saveToastSoundState,
      clearToastSoundState,
      saveSubscriptionsAmount,
      clearSubscriptionsAmount,
    };
  }, [
    getAuthToken,
    saveAuthToken,
    clearAuthToken,
    toastSoundEnabled,
    saveToastSoundState,
    clearToastSoundState,
    saveSubscriptionsAmount,
    clearSubscriptionsAmount,
  ]);

  return (
    <TradingCopilotContext.Provider value={contextValue}>
      {children}
    </TradingCopilotContext.Provider>
  );
};

export const useTradingCopilot = createContextHook(TradingCopilotContext);
