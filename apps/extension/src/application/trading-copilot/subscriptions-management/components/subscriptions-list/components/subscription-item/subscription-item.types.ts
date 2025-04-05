import {
  FarcasterUserDetails,
  SubscriptionResponse,
  UnsubscribePayload,
} from 'application/trading-copilot/types';

export interface Properties {
  subscription: SubscriptionResponse;
  onRemove: (payload: UnsubscribePayload) => Promise<void>;
}

export interface ContentProperties extends Properties {
  name: string;
  avatar?: string | null;
  farcasterDetails?: FarcasterUserDetails;
}
