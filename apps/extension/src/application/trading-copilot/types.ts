import { Hex } from 'shared/web3';

export type SubscriptionRequest = {
  subscriberId: string;
  address: Hex;
};

export type SubscriptionResponse = Hex;

export type SubscriptionsRequest = {
  subscriberId: string;
};

export type SubscriptionsResponse = {
  subscriberId: string;
  addresses: SubscriptionResponse[];
};

type SwapDataToken = {
  symbol: string;
  amount: number;
};

export type SwapData = {
  tokenIn: SwapDataToken;
  tokenOut: SwapDataToken;
};
