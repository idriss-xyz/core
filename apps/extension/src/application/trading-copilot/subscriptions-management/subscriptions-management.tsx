import { Button } from '@idriss-xyz/ui/button';
import { classes } from '@idriss-xyz/ui/utils';
import { Link } from '@idriss-xyz/ui/link';

import { useWallet } from 'shared/extension';
import { Empty } from 'shared/ui';

import { SubscribePayload, UnsubscribePayload } from '../types';
import { useSubscriptions } from '../hooks';

import { SubscriptionForm, SubscriptionsList } from './components';
import { ContentProperties } from './subscriptions-management.types';

export const SubscriptionsManagement = () => {
  const { wallet, isConnectionModalOpened, openConnectionModal } = useWallet();

  return (
    <>
      {wallet ? (
        <SubscriptionsManagementContent wallet={wallet} />
      ) : (
        <>
          <Empty
            text="Log in to see your subscriptions list"
            className="mt-10"
          />
          <Button
            size="medium"
            intent="primary"
            className="mx-auto mt-10"
            onClick={openConnectionModal}
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

const SubscriptionsManagementContent = ({ wallet }: ContentProperties) => {
  const { subscriptions, subscribe, unsubscribe, canSubscribe } =
    useSubscriptions({
      wallet,
      addTabListener: true,
    });

  const handleUnsubscribe = (payload: UnsubscribePayload) => {
    return unsubscribe.use(payload);
  };

  const handleSubscribe = (payload: SubscribePayload) => {
    return subscribe.use(payload);
  };

  return (
    <>
      <SubscriptionForm
        onSubmit={handleSubscribe}
        canSubscribe={canSubscribe}
      />
      <SubscriptionsList
        onRemove={handleUnsubscribe}
        subscriptions={subscriptions.data}
        subscriptionsAmount={subscriptions.amount}
        subscriptionsLoading={subscriptions.isSending}
        className="mt-6 flex h-full flex-col overflow-hidden"
      />
    </>
  );
};
