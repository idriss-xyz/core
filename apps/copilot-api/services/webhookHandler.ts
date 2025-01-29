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
    const webhookEvent = req.body as ComplexHeliusWebhookEvent;

    await handleIncomingSolanaEvent(webhookEvent);

    res.send('Solana Event received');
  };
};
