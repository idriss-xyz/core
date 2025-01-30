import { AlchemyWebhookType } from './types';

export interface AlchemyRequest extends Request {
  alchemy: {
    rawBody: string;
    signature: string;
  };
}

export interface AlchemyWebhookEvent {
  webhookId: string;
  id: string;
  createdAt: Date;
  type: AlchemyWebhookType;
  event: {
    network: string;
    activity: any[];
  };
}

// TODO: Use one or the other (ComplexHeliusWebhookEvent or HeliusWebhookEvent)
export interface HeliusWebhookEvent {
  accountData: any;
  events: { [eventName: string]: Record<string, unknown> };
  slot: number;
}

// TODO: Use one or the other (ComplexHeliusWebhookEvent or HeliusWebhookEvent)
export interface ComplexHeliusWebhookEvent {
  accountData: {
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges: {
      mint: string;
      rawTokenAmount: {
        decimals: number;
        tokenAmount: string;
      };
      tokenAccount: string;
      userAccount: string;
    }[];
  }[];
  description: string;
  events: { [eventName: string]: Record<string, unknown> };
  fee: number;
  feePayer: string;
  instructions: any[];
  nativeTransfers: {
    amount: number;
    fromUserAccount: string;
    toUserAccount: string;
  }[];
  signature: string;
  slot: number;
  source: string;
  timestamp: number;
  tokenTransfers: {
    fromTokenAccount: string;
    fromUserAccount: string;
    mint: string;
    toTokenAccount: string;
    toUserAccount: string;
    tokenAmount: number;
    tokenStandard: string;
  }[];
  type: string;
}
[];

export interface CachedTransaction {
  data: any; // Necessary data from event to extract swap data
  timestamp: number; // Time when the transaction was first added to the cache
  type: 'alchemy' | 'helius';
}

export interface Webhook {
  id: string;
  addresses: Set<string>;
}
