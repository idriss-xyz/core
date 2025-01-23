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
import { onWindowMessage, useCommandMutation } from 'shared/messaging';
// eslint-disable-next-line boundaries/entry-point,boundaries/element-types
import { GetTradingCopilotSubscriptionsCommand } from 'application/trading-copilot/commands';
// eslint-disable-next-line boundaries/entry-point,boundaries/element-types
import { SubscriptionsPayload } from 'application/trading-copilot/types';

import {
  StoredAuthToken,
  StoredSubscriptionsAmount,
  StoredToastSoundState,
  StoredWallet,
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
  onGetWallet,
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
  onGetWallet?: () => Promise<StoredWallet | undefined>;
  onClearSubscriptionsAmount?: () => void;
  onSaveSubscriptionsAmount?: (payload: StoredSubscriptionsAmount) => void;
}) => {
  const [toastSoundEnabled, setToastSoundEnabled] =
    useState<StoredToastSoundState>();
  const [tabChangedListenerInitialized, setTabChangedListenerInitialized] =
    useState(false);
  const getSubscriptionsMutation = useCommandMutation(
    GetTradingCopilotSubscriptionsCommand,
  );

  useEffect(() => {
    const callback = async () => {
      const handleGetSubscriptionsMutation = async (
        payload: SubscriptionsPayload,
      ) => {
        return await getSubscriptionsMutation.mutateAsync(payload);
      };

      if (
        getSubscriptionsMutation.isSuccess ||
        getSubscriptionsMutation.isPending
      ) {
        return;
      }

      const storedWallet = await onGetWallet?.();

      if (!storedWallet) {
        return;
      }

      const subscriptionsResponse = await handleGetSubscriptionsMutation({
        subscriberId: storedWallet.account,
      });

      onSaveSubscriptionsAmount?.(subscriptionsResponse.details.length);
    };

    void callback();
  }, [
    getSubscriptionsMutation,
    getSubscriptionsMutation.isPending,
    getSubscriptionsMutation.isSuccess,
    onGetWallet,
    onSaveSubscriptionsAmount,
  ]);

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
