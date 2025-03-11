import { Request, Response } from 'express';
import { AlchemyWebhookEvent, HeliusWebhookEvent } from '../types';
import { eventCache } from '../services/scheduler';
import { AlchemyEventHandler, HeliusEventHandler } from './eventHandlers';

const eventHandlers = {
  alchemy: new AlchemyEventHandler(),
  helius: new HeliusEventHandler(),
};

// Webhook handler function
export function webhookHandler() {
  return async (req: Request, res: Response): Promise<void> => {
    const webhookEvent = req.body as AlchemyWebhookEvent;

    await handleIncomingEvent(webhookEvent);

    res.send('Event received');
  };
}

export const heliusWebhookHandler = () => {
  return async (req: Request, res: Response): Promise<void> => {
    const webhookEvents = req.body as HeliusWebhookEvent[];

    if (webhookEvents.length === 0) {
      console.error('No transactions found in event response.');
      return;
    }

    const event = webhookEvents[0]; // Get first event

    await handleIncomingSolanaEvent(event);

    res.send('Solana Event received');
  };
};

// Handle incoming events and add them to the cache
export async function handleIncomingEvent(
  webhookEvent: AlchemyWebhookEvent,
): Promise<void> {
  const activities = webhookEvent.event.activity;
  if (!activities || activities.length === 0) {
    console.error('No activity found in the webhook event.');
    return;
  }

  for (const activity of activities) {
    if (!activity.hash) {
      console.error('Transaction hash is missing in an activity.', activity);
      continue;
    }
    const txHash = activity.hash;
    if (!eventCache[txHash]) {
      eventCache[txHash] = {
        data: [],
        timestamp: Date.now(),
        type: 'alchemy',
      };
    }
    activity.network = webhookEvent.event.network?.replace('_MAINNET', '');
    eventCache[txHash].data.push(activity);
  }
}

export async function handleIncomingSolanaEvent(
  webhookEvent: HeliusWebhookEvent,
): Promise<void> {
  const txHash = webhookEvent.signature;

  if (!eventCache[txHash]) {
    eventCache[txHash] = eventHandlers['helius'].formatForCache(webhookEvent);
  }
}
