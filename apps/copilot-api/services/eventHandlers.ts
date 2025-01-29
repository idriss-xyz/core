import { AlchemyWebhookEvent, CachedTransaction, ComplexHeliusWebhookEvent } from "../interfaces";
import { WebhookEventHandler } from "../interfaces/WebhookEvent";
import { SwapData } from "../types";
import { extractAlchemySwapData, extractHeliusSwapData } from "../utils/webhookUtils";

export class AlchemyEventHandler implements WebhookEventHandler {
  formatForCache(event: AlchemyWebhookEvent): CachedTransaction {
    return {
      data: event.event.activity,
      timestamp: Date.now(),
      type: 'alchemy'
    };
  }

  extractSwapData(txHash: string, data: any): Promise<SwapData> {
    return extractAlchemySwapData(txHash, data);
  }
}

export class HeliusEventHandler implements WebhookEventHandler {
  formatForCache(event: ComplexHeliusWebhookEvent): CachedTransaction {
    return {
      data: event,
      timestamp: Date.now(),
      type: 'helius'
    };
  }

  extractSwapData(txHash: string, data: any): Promise<SwapData> {
    return extractHeliusSwapData(txHash, data);
  }
}
