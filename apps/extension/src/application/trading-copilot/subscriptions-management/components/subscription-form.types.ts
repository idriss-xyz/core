import { SubscriptionRequest } from 'application/trading-copilot/types';

export interface Properties {
  onSubmit: (address: SubscriptionRequest['address']) => void;
}

export interface FormValues {
  subscriptionDetails: string;
}
