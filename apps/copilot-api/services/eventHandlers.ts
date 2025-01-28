import { AlchemyWebhookEvent, CachedTransaction, ComplexHeliusWebhookEvent } from "../interfaces";
import { WebhookEventHandler } from "../interfaces/WebhookEvent";
import { SwapData } from "../types";
import { extractAlchemySwapData, extractHeliusSwapData } from "../utils/webhookUtils";

export class AlchemyEventHandler implements WebhookEventHandler {
  formatForCache(event: AlchemyWebhookEvent): CachedTransaction {
    return {
      activities: event.event.activity,
      timestamp: Date.now(),
      type: 'alchemy'
    };
  }

  extractSwapData(txHash: string, activities: any[]): Promise<SwapData> {
    // Existing Alchemy swap data extraction logic
    return extractAlchemySwapData(txHash, activities);
  }
}

export class HeliusEventHandler implements WebhookEventHandler {
  formatForCache(event: ComplexHeliusWebhookEvent): CachedTransaction {
    return {
      activities: event.tokenTransfers,
      timestamp: Date.now(),
      type: 'helius'
    };
  }

  extractSwapData(txHash: string, solanaActivities: any[]): Promise<SwapData> {
    // New Solana-specific swap data extraction logic
    return extractHeliusSwapData(txHash, solanaActivities);
  }
}
