import {
  AlchemyWebhookEvent,
  CachedTransaction,
  HeliusWebhookEvent,
  WebhookEventHandler
} from '../types';
import { SwapData } from '../types';
import {
  extractAlchemySwapData,
  extractHeliusSwapData
} from './webhook';

export class AlchemyEventHandler implements WebhookEventHandler {
  formatForCache(event: AlchemyWebhookEvent): CachedTransaction {
    return {
      data: event.event.activity,
      timestamp: Date.now(),
      type: 'alchemy',
    };
  }

  extractSwapData(txHash: string, data: any): Promise<SwapData> {
    return extractAlchemySwapData(txHash, data);
  }
}

export class HeliusEventHandler implements WebhookEventHandler {
  formatForCache(event: HeliusWebhookEvent): CachedTransaction {
    return {
      data: {
        signature: event.signature,
        accountData: event.accountData,
        instructions: event.instructions,
        tokenTransfers: event.tokenTransfers,
        nativeTransfers: event.nativeTransfers,
        events: event.events,
        feePayer: event.feePayer,
        timestamp: event.timestamp,
        transactionError: event.transactionError,
      },
      timestamp: event.timestamp,
      type: 'helius',
    };
  }

  extractSwapData(txHash: string, data: any): Promise<SwapData> {
    return extractHeliusSwapData(data);
  }
}
