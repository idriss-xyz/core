import { useMemo } from 'react';

import { useCommandMutation, useCommandQuery } from 'shared/messaging';

import {
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
} from '../commands';
import { Subscription } from '../types';

import { SubscriptionForm, SubscriptionsList } from './components';

export const SubscriptionsManagement = () => {
  const subscriptionsQuery = useCommandQuery({
    command: new GetTradingCopilotSubscriptionsCommand({}),
  });

  const subscribe = useCommandMutation(AddTradingCopilotSubscriptionCommand);
  const unsubscribe = useCommandMutation(
    RemoveTradingCopilotSubscriptionCommand,
  );

  const subscriptionsUpdatePending = useMemo(() => {
    return (
      subscribe.isPending ||
      unsubscribe.isPending ||
      subscriptionsQuery.isRefetching
    );
  }, [
    subscribe.isPending,
    subscriptionsQuery.isRefetching,
    unsubscribe.isPending,
  ]);

  const subscriptions = useMemo(() => {
    return subscriptionsQuery.data ?? [];
  }, [subscriptionsQuery.data]);

  const hasSubscriptions = useMemo(() => {
    return subscriptions.length > 0;
  }, [subscriptions.length]);

  const handleAddNewSubscription = async (subscription: Subscription) => {
    await subscribe.mutateAsync({ subscription });
    void subscriptionsQuery.refetch();
  };

  const handleUnsubscribe = async (ensName: Subscription['ensName']) => {
    await unsubscribe.mutateAsync({ ensName });
    void subscriptionsQuery.refetch();
  };

  return (
    <>
      <SubscriptionForm onSubmit={handleAddNewSubscription} />
      <div className="mt-4">
        <SubscriptionsList.Header />
        {subscriptionsQuery.isLoading && <SubscriptionsList.Loading />}
        {!hasSubscriptions && <SubscriptionsList.Empty />}
        {hasSubscriptions && (
          <SubscriptionsList
            subscriptions={subscriptions}
            onRemove={handleUnsubscribe}
            subscriptionsUpdatePending={subscriptionsUpdatePending}
          />
        )}
      </div>
    </>
  );
};
