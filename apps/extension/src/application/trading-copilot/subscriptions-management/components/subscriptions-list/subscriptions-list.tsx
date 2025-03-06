import { useMemo } from 'react';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { Empty, Spinner } from 'shared/ui';

import { SoundToggle } from '../sound-toggle';

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

    if (subscriptions === undefined || subscriptions.details.length === 0) {
      return (
        <Empty text="Your subscriptions list is empty" className="mt-10" />
      );
    }

    return (
      <div className="relative mt-2 h-full overflow-hidden">
        <ScrollArea className="size-full overflow-y-auto transition-all duration-500">
          <ul className="flex flex-col gap-y-3 pr-4">
            {subscriptions.details
              .filter((subscription, index, self) => {
                if (subscription.fid === null) return true;
                return (
                  index ===
                  self.findIndex((s) => {
                    return s.fid === subscription.fid;
                  })
                );
              })
              .map((subscription) => {
                return (
                  <SubscriptionItem
                    subscription={subscription}
                    key={subscription.address}
                    onRemove={onRemove}
                  />
                );
              })}
          </ul>
        </ScrollArea>
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
      <div className="flex items-center justify-between pr-4">
        <p className="mb-1 block text-label4 text-neutralGreen-700">
          Your subscriptions
        </p>
        <SoundToggle />
      </div>
      {subscriptionsListBody}
    </div>
  );
};
