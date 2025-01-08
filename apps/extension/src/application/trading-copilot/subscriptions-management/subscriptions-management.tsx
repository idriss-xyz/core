import { useWallet } from '@idriss-xyz/wallet-connect';
import { Button } from '@idriss-xyz/ui/button';
import { useEffect } from 'react';

import {
  onWindowMessage,
  TAB_CHANGED,
  useCommandMutation,
  useCommandQuery,
} from 'shared/messaging';
import { Empty } from 'shared/ui';

import {
  AddTradingCopilotSubscriptionCommand,
  GetTradingCopilotSubscriptionsCommand,
  RemoveTradingCopilotSubscriptionCommand,
} from '../commands';
import { SubscriptionRequest } from '../types';

import { SubscriptionForm, SubscriptionsList } from './components';
import {
  Properties,
  ContentProperties,
} from './subscriptions-management.types';

export const SubscriptionsManagement = ({
  isTabChangedListenerAdded,
}: Properties) => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();

  return wallet ? (
    <SubscriptionsManagementContent
      subscriberId={wallet.account}
      isTabChangedListenerAdded={isTabChangedListenerAdded}
    />
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
  isTabChangedListenerAdded,
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

  useEffect(() => {
    if (!isTabChangedListenerAdded.current) {
      const handleTabChange = async () => {
        await subscriptionsQuery.refetch();
      };

      onWindowMessage(TAB_CHANGED, handleTabChange);
      isTabChangedListenerAdded.current = true;
    }
  }, [isTabChangedListenerAdded, subscriptionsQuery]);

  const handleSubscribe = async (
    address: SubscriptionRequest['subscription']['address'],
    fid: SubscriptionRequest['subscription']['fid'],
  ) => {
    await subscribe.mutateAsync({
      subscription: { address, fid, subscriberId },
      authToken: localStorage.getItem('authToken') ?? '',
    });
    void subscriptionsQuery.refetch();
  };

  const handleUnsubscribe = async (
    address: SubscriptionRequest['subscription']['address'],
  ) => {
    await unsubscribe.mutateAsync({
      subscription: { address, subscriberId },
      authToken: localStorage.getItem('authToken') ?? '',
    });
    void subscriptionsQuery.refetch();
  };

  return (
    <>
      <SubscriptionForm
        onSubmit={handleSubscribe}
        subscriptionsAmount={subscriptionsQuery?.data?.details.length}
      />
      <SubscriptionsList
        className="mt-6 flex h-full flex-col overflow-hidden"
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
