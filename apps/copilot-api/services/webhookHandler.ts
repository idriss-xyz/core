import { Request, Response } from 'express';
import { AlchemyWebhookEvent, ComplexHeliusWebhookEvent } from '../interfaces';
import {
  handleIncomingEvent,
  handleIncomingSolanaEvent,
} from '../utils/webhookUtils';

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
    const webhookEvents = req.body as ComplexHeliusWebhookEvent[];

    if (webhookEvents.length === 0) {
      console.error('No transactions found in event response.');
      return;
    }

    const event = webhookEvents[0]; // Get first event

    await handleIncomingSolanaEvent(event);

    res.send('Solana Event received');
  };
};
