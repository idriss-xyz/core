import { Estimate, Step, TransactionRequest } from '@lifi/sdk';
import { WEBHOOK_NETWORK_TYPES } from '../constants';
import { SwapData } from './shared.types';

export interface WebhookDataInterface {
  webhookId: string;
  internalWebhookId: string;
  chainType: keyof typeof WEBHOOK_NETWORK_TYPES;
  signingKey: string;
}

export interface SubscriptionsDetailsInterface {
  address: string;
  fid: number | null;
  createdAt: number;
}

export interface CachedTransaction {
  data: any;
  timestamp: number; // Time when the transaction was first added to the cache
  type: 'alchemy' | 'helius';
}

export type CachedEventsInterface = Record<string, CachedTransaction>;

export interface GetQuoteDataResponseInterface {
  success: boolean;
  estimate: Estimate;
  type: 'lifi';
  tool: string;
  includedSteps: Step[];
  transactionData?: TransactionRequest;
}

export interface GetQuoteDataInterface {
  fromAddress: string;
  originChain: string;
  destinationChain: string;
  originToken: string;
  destinationToken: string;
  amount: string;
}

export interface TopAddressesResponseInterface {
  address: string;
  count: number;
}

// TODO: Correctly type event (no any) and data (no any)
export interface WebhookEventHandler {
  formatForCache(event: any): CachedTransaction;
  extractSwapData(txHash: string, data: any): Promise<SwapData>;
}
