import { Button } from '@idriss-xyz/ui/button';
import { useEffect } from 'react';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';
import { isAddress as isSolanaAddress } from '@solana/web3.js';

import { useWallet, useAuthToken } from 'shared/extension';
import {
  onWindowMessage,
  TAB_CHANGED,
  useCommandMutation,
  useCommandQuery,
} from 'shared/messaging';
import { Empty } from 'shared/ui';

import { useLoginViaSiwe } from '../hooks';
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

  return (
    <>
      {wallet ? (
        <SubscriptionsManagementContent
          wallet={wallet}
          subscriberId={wallet.account}
          isTabChangedListenerAdded={isTabChangedListenerAdded}
        />
      ) : (
        <>
          <Empty
            text="Log in to see your subscriptions list"
            className="mt-10"
          />
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
      )}
      <div className="mt-auto self-stretch text-center opacity-70">
        <span
          className={classes(
            'text-body6 text-neutralGreen-900',
            'md:text-body6',
          )}
        >
          Only trade on sites you trust.{' '}
        </span>
        <Link
          size="medium"
          href="https://support.metamask.io/more-web3/dapps/user-guide-dapps/"
          isExternal
          className={classes(
            'border-none text-body6',
            'md:text-body6',
            //lg here is intentional to override the Link variant style
            'lg:text-body6',
          )}
        >
          Learn{'\u00A0'}more
        </Link>
      </div>
    </>
  );
};

const SubscriptionsManagementContent = ({
  subscriberId,
  isTabChangedListenerAdded,
  wallet,
}: ContentProperties) => {
  const siwe = useLoginViaSiwe();
  const { getAuthToken } = useAuthToken();

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
    chainType?: 'EVM' | 'SOLANA',
  ) => {
    const siweLoggedIn = await siwe.loggedIn();

    if (!siweLoggedIn) {
      await siwe.login(wallet);
    }

    const authToken = await getAuthToken();

    await subscribe.mutateAsync({
      subscription: { address, fid, subscriberId, chainType },
      authToken: authToken ?? '',
    });
    void subscriptionsQuery.refetch();
  };

  const handleUnsubscribe = async (
    address: SubscriptionRequest['subscription']['address'],
  ) => {
    const siweLoggedIn = await siwe.loggedIn();

    if (!siweLoggedIn) {
      await siwe.login(wallet);
    }

    const authToken = await getAuthToken();

    let chainType: 'SOLANA' | 'EVM' = 'EVM';
    if (isSolanaAddress(address)) {
      chainType = 'SOLANA';
    }

    await unsubscribe.mutateAsync({
      subscription: { address, subscriberId, chainType },
      authToken: authToken ?? '',
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
