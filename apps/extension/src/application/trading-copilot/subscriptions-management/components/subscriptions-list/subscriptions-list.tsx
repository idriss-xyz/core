import { useMemo } from 'react';

import { Empty, Spinner } from 'shared/ui';

import { ListProperties } from './subscription-list.types';
import { SubscriptionItem } from './subscription-item';

export const SubscriptionsList = ({
  onRemove,
  className,
  subscriptions,
  subscriptionsLoading,
  subscriptionsUpdatePending,
}: ListProperties) => {
  const subscriptionsListBody = useMemo(() => {
    if (subscriptionsLoading) {
      return (
        <Spinner className="mt-10 flex w-full items-center justify-center" />
      );
    }

    if (subscriptions === undefined || subscriptions.addresses.length === 0) {
      return (
        <Empty text="Your subscriptions list is empty" className="mt-10" />
      );
    }

    return (
      <div className="relative mt-2 h-full overflow-y-auto">
        <ul className="flex flex-col gap-y-3">
          {subscriptions.addresses.map((subscription) => {
            return (
              <SubscriptionItem
                subscription={subscription}
                key={subscription}
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
        Your subscriptions
      </p>
      {subscriptionsListBody}
    </div>
  );
};
