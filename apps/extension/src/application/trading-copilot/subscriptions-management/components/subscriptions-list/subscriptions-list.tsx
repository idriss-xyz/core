import { useMemo } from 'react';
import { ScrollArea } from '@idriss-xyz/ui/scroll-area';

import { Empty, Spinner } from 'shared/ui';

import { Properties } from './subscription-list.types';
import { SubscriptionItem, SoundToggle } from './components';

export const SubscriptionsList = ({
  onRemove,
  className,
  subscriptions,
  subscriptionsAmount,
  subscriptionsLoading,
}: Properties) => {
  const subscriptionsListBody = useMemo(() => {
    if (subscriptionsLoading) {
      return (
        <Spinner className="mt-10 flex w-full items-center justify-center" />
      );
    }

    if (subscriptions === undefined || subscriptionsAmount === 0) {
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
                  onRemove={onRemove}
                  key={subscription.address}
                  subscription={subscription}
                />
              );
            })}
          </ul>
        </ScrollArea>
      </div>
    );
  }, [onRemove, subscriptions, subscriptionsAmount, subscriptionsLoading]);

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
