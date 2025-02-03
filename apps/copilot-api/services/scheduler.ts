import { Socket } from 'socket.io';
import { BLOCK_LIST } from '../constants';
import { CachedEventsInterface } from '../types';
import { extractSwapData } from './webhook';
import { getSubscribersByAddress } from './subscriptionManager';

// Map to store userId to socket mappings
export const connectedClients = new Map<string, Socket>();
export const eventCache: CachedEventsInterface = {};

// Scheduler to process the cache every 2 seconds
setInterval(async () => {
  const now = Date.now();
  const cacheEntries = Object.entries(eventCache);

  for (const [txHash, cachedTransaction] of cacheEntries) {
    const { activities, timestamp } = cachedTransaction;
    const swapData = await extractSwapData(txHash, activities);

    if (swapData.isComplete) {
      // Complete swap

      // Send swapData to subscribed users
      const addresses = [swapData.from, swapData.to];
      for (const address of addresses) {
        if (address) {
          const subscriberIds = await getSubscribersByAddress(address);
          if (BLOCK_LIST.includes(swapData.tokenIn?.symbol as string)) {
            continue;
          }
          for (const subscriberId of subscriberIds) {
            const clientSocket = connectedClients.get(subscriberId);
            if (clientSocket) {
              clientSocket.emit('swapEvent', swapData);
            }
          }
        }
      }

      // Remove from cache
      delete eventCache[txHash];
    } else {
      // Check if the transaction has been in the cache for more than 2 seconds
      if (now - timestamp >= 5000) {
        // Incomplete swap, time expired
        // Remove from cache
        delete eventCache[txHash];
      }
      // If not expired, keep it in the cache
    }
  }
}, 2000);
