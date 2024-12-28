import { CHAIN, Hex } from 'shared/web3';

export type SubscriptionRequest = {
  subscriberId: string;
  address: string;
};

export type SubscriptionResponse = Hex;

export type SubscriptionsRequest = {
  subscriberId: string;
};

export type SubscriptionsResponse = {
  subscriberId: string;
  addresses: SubscriptionResponse[];
};

export type FarcasterAddressRequest = {
  name: string;
};

export type FarcasterAddressResponse = string | null;

export type FarcasterTransfersResponse = {
  transfer: {
    id: number;
    timestamp: number;
    username: string;
    owner: string;
    from: number;
    to: number;
    user_signature: string;
    server_signature: string;
  };
};

type FarcasterConnectedAddress = {
  address: string;
  fid: number;
  protocol: string;
  timestamp: number;
  version: string;
};

export type FarcasterConnectedAddressesResponse = {
  result: {
    verifications: FarcasterConnectedAddress[];
  };
};

type SwapDataToken = {
  address: Hex;
  symbol: string;
  amount: number;
  decimals: number;
  network: keyof typeof CHAIN;
};

export type SwapData = {
  transactionHash: Hex;
  from: Hex;
  to: Hex;
  tokenIn: SwapDataToken;
  tokenOut: SwapDataToken;
  timestamp: string;
  isComplete: boolean;
};

export interface FormValues {
  amount: string;
}

export type SiweMessageRequest = {
  walletAddress: Hex;
  chainId: number;
};

export type SiweMessageResponse = {
  nonce: string;
  message: string;
};

export type VerifySiweSignatureRequest = {
  walletAddress: Hex;
  message: string;
  signature: Hex;
};

export type VerifySiweSignatureResponse = {
  token: string;
};
