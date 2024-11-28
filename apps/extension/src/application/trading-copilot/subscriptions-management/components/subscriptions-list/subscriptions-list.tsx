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
        <Spinner className="mt-14 flex w-full items-center justify-center" />
      );
    }

    if (subscriptions.length === 0) {
      return (
        <Empty text="Your subscriptions list is empty" className="mt-14" />
      );
    }

    return (
      <div className="relative">
        <ul className="space-y-2">
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
      <p className="mb-2 text-sm font-semibold leading-6 text-mint-900">
        Your Subscriptions
      </p>
      {subscriptionsListBody}
    </div>
  );
};
