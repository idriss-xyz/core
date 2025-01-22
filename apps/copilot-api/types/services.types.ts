import { CachedTransaction } from './shared.types';
import { Estimate, Step, TransactionRequest } from '@lifi/sdk';

export interface WebhookDataInterface {
  webhookId: string;
  internalWebhookId: string;
  signingKey: string;
}

export interface SubscriptionsDetailsInterface {
  address: string;
  fid: number | null;
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
