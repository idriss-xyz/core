import { Spinner } from 'shared/ui';

import { Subscription } from '../../../types';

import { SubscriptionItem } from './subscription-item';
import { SubscriptionsListHeader } from './subscriptions-header';
import { SubscriptionsListLoading } from './subscriptions-list-loading';
import { SubscriptionsListEmpty } from './subscriptions-list-empty';

type Properties = {
  subscriptions: Subscription[];
  subscriptionsUpdatePending: boolean;
  onRemove: (ensName: Subscription['ensName']) => void;
};

const Base = ({
  subscriptions,
  subscriptionsUpdatePending,
  onRemove,
}: Properties) => {
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
};

export const SubscriptionsList = Object.assign(Base, {
  Header: SubscriptionsListHeader,
  Loading: SubscriptionsListLoading,
  Empty: SubscriptionsListEmpty,
});
