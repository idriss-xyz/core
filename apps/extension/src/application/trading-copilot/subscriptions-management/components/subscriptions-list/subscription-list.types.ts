import {
  FarcasterUserResponse,
  SubscriptionRequest,
  SubscriptionResponse,
  SubscriptionsResponse,
} from 'application/trading-copilot/types';

export interface ListProperties {
  className?: string;
  subscriptionsLoading: boolean;
  subscriptionsUpdatePending: boolean;
  subscriptions: SubscriptionsResponse | undefined;
  onRemove: (address: SubscriptionRequest['subscription']['address']) => void;
}

export interface ItemProperties {
  subscription: SubscriptionResponse;
  onRemove: (address: SubscriptionRequest['subscription']['address']) => void;
}

export interface ItemContentProperties extends ItemProperties {
  ensName: string;
  avatar: string | null | undefined;
  isFallback: boolean;
  loading: boolean;
  farcasterSubscriptionDetails?: FarcasterUserResponse;
}
