import { useMemo } from 'react';

import { Empty, Spinner } from 'shared/ui';

import { Subscription } from '../../../types';

import { SubscriptionItem } from './subscription-item';

type Properties = {
  subscriptions: Subscription[];
  subscriptionsLoading: boolean;
  subscriptionsUpdatePending: boolean;
  className?: string;
  onRemove: (ensName: Subscription['ensName']) => void;
};

export const SubscriptionsList = ({
  subscriptions,
  subscriptionsLoading,
  subscriptionsUpdatePending,
  onRemove,
  className,
}: Properties) => {
  const subscriptionsListBody = useMemo(() => {
    if (subscriptionsLoading) {
      return (
        <Spinner className="mt-10 flex w-full items-center justify-center" />
      );
    }

    if (subscriptions.length === 0) {
      return (
        <Empty text="Your subscriptions list is empty" className="mt-10" />
      );
    }

    return (
      <div className="relative mt-2">
        <ul>
          {subscriptions.map((subscription) => {
            return (
              <SubscriptionItem
                subscription={subscription}
                key={subscription.ensName}
                onRemove={onRemove}
              />
            );
          })}
        </ul>
        {subscriptionsUpdatePending && (
          <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        )}
      </div>
    );
  }, [
    onRemove,
    subscriptions,
    subscriptionsLoading,
    subscriptionsUpdatePending,
  ]);

  return (
    <div className={className}>
      <p className="mb-1 block text-label4 text-neutralGreen-700">
        Your Subscriptions
      </p>
      {subscriptionsListBody}
    </div>
  );
};
