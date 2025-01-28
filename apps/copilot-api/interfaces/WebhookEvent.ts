import { CachedTransaction } from "../interfaces";
import { SwapData } from "../types";

// TODO: Correctly type event (no any) and data (no any)
export interface WebhookEventHandler {
  formatForCache(event: any): CachedTransaction;
  extractSwapData(txHash: string, data: any): Promise<SwapData>;
}
