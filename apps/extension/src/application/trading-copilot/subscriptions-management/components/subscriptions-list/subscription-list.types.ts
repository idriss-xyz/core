import {
  SubscriptionsResponse,
  UnsubscribePayload,
} from 'application/trading-copilot/types';

export interface Properties {
  className?: string;
  subscriptionsLoading: boolean;
  subscriptionsAmount: number | undefined;
  onRemove: (payload: UnsubscribePayload) => void;
  subscriptions: SubscriptionsResponse | undefined;
}
