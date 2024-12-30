import { useWallet } from '@idriss-xyz/wallet-connect';
import { Button } from '@idriss-xyz/ui/button';

import { useCommandMutation, useCommandQuery } from 'shared/messaging';
import { Empty } from 'shared/ui';

import {
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
} from '../commands';
import { SubscriptionRequest } from '../types';

import { SubscriptionForm, SubscriptionsList } from './components';
import { ContentProperties } from './subscriptions-management.types';

export const SubscriptionsManagement = () => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();

  return wallet ? (
    <SubscriptionsManagementContent subscriberId={wallet.account} />
  ) : (
    <>
      <Empty text="Log in to see your subscriptions list" className="mt-10" />
      <Button
        intent="primary"
        size="medium"
        onClick={openConnectionModal}
        className="mx-auto mt-10"
        loading={isConnectionModalOpened}
      >
        LOG IN
      </Button>
    </>
  );
};

const SubscriptionsManagementContent = ({
  subscriberId,
}: ContentProperties) => {
  const subscriptionsQuery = useCommandQuery({
    command: new GetTradingCopilotSubscriptionsCommand({
      subscriberId,
    }),
    staleTime: Number.POSITIVE_INFINITY,
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
