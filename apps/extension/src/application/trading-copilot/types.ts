import { Hex } from 'viem';

import { CHAIN } from 'shared/web3';

export interface SubscribePayload {
  fid?: number;
  address: string;
}

export type SubscribeCommandPayload = {
  subscription: {
    subscriberId: string;
  } & SubscribePayload;
  authToken: string;
};

export type UnsubscribePayload = {
  address: string;
};

export type UnsubscribeCommandPayload = {
  subscription: {
    subscriberId: string;
  } & UnsubscribePayload;
  authToken: string;
};

export type SubscriptionsPayload = {
  subscriberId: string;
};

export type SubscriptionResponse = {
  address: Hex;
  fid?: number | null;
  createdAt: number;
};

export type SubscriptionsResponse = {
  subscriberId: string;
  details: SubscriptionResponse[];
};

export type FarcasterAddressPayload = {
  name: string;
};

export type FarcasterAddressResponse = {
  fid: number;
  address: string;
} | null;

export type FarcasterTransferResponse = {
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

export type FarcasterUserPayload = {
  id: number;
};

export type FarcasterUserDetails = {
  fid: number;
  displayName: string;
  pfp: {
    url: string;
  };
};

// We can expand those types, currently we added only used ones
export type FarcasterUserResponse = {
  result: {
    user: FarcasterUserDetails;
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
  soundFile?: string;
};

export interface QuotePayload {
  amount: string;
  originChain: number;
  originToken: string;
  fromAddress: string;
  destinationToken: string;
  destinationChain: number;
}

export type QuoteResponse = {
  success: boolean;
  estimate: Estimate;
  type: string;
  tool: string;
  includedSteps: IncludedStep[];
  transactionData: TransactionData;
  options: Options;
};

type Estimate = {
  tool: string;
  approvalAddress: string;
  toAmountMin: string;
  toAmount: string;
  fromAmount: string;
  feeCosts: FeeCost[];
  gasCosts: GasCost[];
  executionDuration: number;
  fromAmountUSD: string;
  toAmountUSD: string;
};

type FeeCost = {
  name: string;
  description: string;
  token: Token;
  amount: string;
  amountUSD: string;
  percentage: string;
  included: boolean;
};

type Token = {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
};

type GasCost = {
  type: string;
  price: string;
  estimate: string;
  limit: number;
  amount: string;
  amountUSD: string;
  token: Token;
};

type IncludedStep = {
  id: string;
  type: string;
  action: Action;
  estimate: Estimate;
  tool: string;
  toolDetails: ToolDetails;
};

type Action = {
  fromChainId: number;
  fromAmount: string;
  fromToken: Token;
  toChainId: number;
  toToken: Token;
  slippage: number;
  fromAddress: string;
  destinationGasConsumption: string;
  destinationCallData: string;
  toAddress: string;
};

type ToolDetails = {
  key: string;
  name: string;
  logoURI: string;
};

type TransactionData = {
  data: `0x${string}`;
  to: `0x${string}`;
  value: string;
  from: `0x${string}`;
  chainId: number;
  gasPrice: string;
  gasLimit: string;
};

type Options = {
  allowSwitchChain: boolean;
};

export interface FormValues {
  amount: string;
}

export type SiweMessagePayload = {
  walletAddress: Hex;
  chainId: number;
  domain: string;
};

export type SiweMessageResponse = {
  nonce: string;
  message: string;
};

export type VerifySiweSignaturePayload = {
  walletAddress: Hex;
  message: string;
  signature: Hex;
};

export type VerifySiweSignatureResponse = {
  token: string;
};
