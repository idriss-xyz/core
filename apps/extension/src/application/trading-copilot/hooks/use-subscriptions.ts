import { useCallback, useEffect, useRef } from 'react';

import {
  onWindowMessage,
  TAB_CHANGED,
  useCommandMutation,
  useCommandQuery,
} from 'shared/messaging';
import { Wallet } from 'shared/web3';
import { useTradingCopilot } from 'shared/extension';

import {
  GetEnsStakedBalanceCommand,
  GetEnsStakedBonusBalanceCommand,
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
  PREMIUM_THRESHOLD,
  FREE_SUBSCRIPTIONS,
} from '../commands';
import { SubscribePayload, UnsubscribePayload } from '../types';

import { useLoginViaSiwe } from './use-login-via-siwe';

interface Properties {
  wallet: Wallet;
  addTabListener?: boolean;
}

export const useSubscriptions = ({ wallet, addTabListener }: Properties) => {
  const { getAuthToken, saveSubscriptionsAmount } = useTradingCopilot();
  const siwe = useLoginViaSiwe();
  const tabChangedListenerAdded = useRef(false);

  const subscribeMutation = useCommandMutation(
    AddTradingCopilotSubscriptionCommand,
  );
  const unsubscribeMutation = useCommandMutation(
    RemoveTradingCopilotSubscriptionCommand,
  );
  const subscriptionsQuery = useCommandQuery({
    command: new GetTradingCopilotSubscriptionsCommand({
      subscriberId: wallet.account,
    }),
    staleTime: Number.POSITIVE_INFINITY,
  });
  const stakedBalanceQuery = useCommandQuery({
    command: new GetEnsStakedBalanceCommand({
      args: wallet?.account,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    retryDelay: 5000,
  });
  const stakedBonusBalanceQuery = useCommandQuery({
    command: new GetEnsStakedBonusBalanceCommand({
      address: wallet?.account,
    }),
    staleTime: Number.POSITIVE_INFINITY,
    retryDelay: 5000,
  });
  const stakedBalanceSum =
    Number(stakedBalanceQuery.data) + Number(stakedBonusBalanceQuery.data);

  const isPremiumUser = stakedBalanceSum >= PREMIUM_THRESHOLD;
  const canSubscribe =
    isPremiumUser ||
    Number(subscriptionsQuery.data?.details.length) < FREE_SUBSCRIPTIONS;

  useEffect(() => {
    if (subscriptionsQuery.isSuccess) {
      saveSubscriptionsAmount(subscriptionsQuery.data?.details.length);
    }
  }, [
    saveSubscriptionsAmount,
    subscriptionsQuery.isSuccess,
    subscriptionsQuery.data?.details.length,
  ]);

  useEffect(() => {
    if (!tabChangedListenerAdded.current && addTabListener) {
      const handleTabChange = async () => {
        await subscriptionsQuery.refetch();
      };

      onWindowMessage(TAB_CHANGED, handleTabChange);
      tabChangedListenerAdded.current = true;
    }
  }, [addTabListener, tabChangedListenerAdded, subscriptionsQuery]);

  const verifySiweStatus = useCallback(async () => {
    const siweLoggedIn = await siwe.loggedIn();

    if (!siweLoggedIn) {
      await siwe.login(wallet);
    }
  }, [siwe, wallet]);

  const subscribeCallback = useCallback(
    async (payload: SubscribePayload) => {
      if (subscribeMutation.isPending) {
        return;
      }

      await verifySiweStatus();
      const authToken = await getAuthToken();

      await subscribeMutation.mutateAsync({
        subscription: { ...payload, subscriberId: wallet.account },
        authToken: authToken ?? '',
      });

      void subscriptionsQuery.refetch();
    },
    [
      getAuthToken,
      subscribeMutation,
      subscriptionsQuery,
      verifySiweStatus,
      wallet.account,
    ],
  );

  const unsubscribeCallback = useCallback(
    async (payload: UnsubscribePayload) => {
      if (unsubscribeMutation.isPending) {
        return;
      }

      await verifySiweStatus();
      const authToken = await getAuthToken();

      await unsubscribeMutation.mutateAsync({
        subscription: { ...payload, subscriberId: wallet.account },
        authToken: authToken ?? '',
      });

      void subscriptionsQuery.refetch();
    },
    [
      getAuthToken,
      subscriptionsQuery,
      unsubscribeMutation,
      verifySiweStatus,
      wallet.account,
    ],
  );

  const subscribe = {
    use: (payload: SubscribePayload) => {
      return subscribeCallback(payload);
    },
    isError: subscribeMutation.isError,
    isSending: subscribeMutation.isPending,
    isSuccess: subscribeMutation.isSuccess,
  };

  const unsubscribe = {
    use: (payload: UnsubscribePayload) => {
      return unsubscribeCallback(payload);
    },
    isError: unsubscribeMutation.isError,
    isSending: unsubscribeMutation.isPending,
    isSuccess: unsubscribeMutation.isSuccess,
  };

  const subscriptions = {
    data: subscriptionsQuery.data,
    refetch: subscriptionsQuery.refetch,
    isError: subscriptionsQuery.isError,
    isSending: subscriptionsQuery.isPending,
    isSuccess: subscriptionsQuery.isSuccess,
    amount: subscriptionsQuery.data?.details.length,
  };

  return {
    subscribe,
    unsubscribe,
    canSubscribe,
    subscriptions,
  };
};
