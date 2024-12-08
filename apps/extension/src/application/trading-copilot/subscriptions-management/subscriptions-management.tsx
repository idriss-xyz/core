import { useCommandMutation, useCommandQuery } from 'shared/messaging';

import {
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
} from '../commands';
import { SubscriptionRequest } from '../types';

import { SubscriptionForm, SubscriptionsList } from './components';

export const SubscriptionsManagement = () => {
  const subscriberId = 'id1';

  const subscriptionsQuery = useCommandQuery({
    command: new GetTradingCopilotSubscriptionsCommand({
      subscriberId,
    }),
  });

  const subscribe = useCommandMutation(AddTradingCopilotSubscriptionCommand);
  const unsubscribe = useCommandMutation(
    RemoveTradingCopilotSubscriptionCommand,
  );

  const handleSubscribe = async (address: SubscriptionRequest['address']) => {
    await subscribe.mutateAsync({ address, subscriberId });
    void subscriptionsQuery.refetch();
  };

  const handleUnsubscribe = async (address: SubscriptionRequest['address']) => {
    await unsubscribe.mutateAsync({ address, subscriberId });
    void subscriptionsQuery.refetch();
  };

  return (
    <>
      <SubscriptionForm onSubmit={handleSubscribe} />
      <SubscriptionsList
        className="mt-6"
        subscriptions={subscriptionsQuery.data}
        subscriptionsLoading={subscriptionsQuery.isLoading}
        subscriptionsUpdatePending={
          subscribe.isPending ||
          unsubscribe.isPending ||
          subscriptionsQuery.isRefetching
        }
        onRemove={handleUnsubscribe}
      />
    </>
  );
};
