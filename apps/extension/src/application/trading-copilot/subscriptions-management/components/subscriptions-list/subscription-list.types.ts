import {
  SubscriptionsResponse,
  UnsubscribePayload,
} from 'application/trading-copilot/types';

export interface Properties {
  className?: string;
  subscriptionsAmount?: number;
  subscriptionsLoading: boolean;
  subscriptions?: SubscriptionsResponse;
  onRemove: (payload: UnsubscribePayload) => Promise<void>;
}
