import { SubscriptionRequest } from 'application/trading-copilot/types';

export interface Properties {
  onSubmit: (
    address: SubscriptionRequest['subscription']['address'],
    fid?: SubscriptionRequest['subscription']['fid'],
    chainType?: "EVM" | "SOLANA",
  ) => void;
  subscriptionsAmount: number | undefined;
}

export interface FormValues {
  subscriptionDetails: string;
}
