import { Request, Response } from 'express';
import { AlchemyWebhookEvent } from '../interfaces';
import { handleIncomingEvent } from '../utils/webhookUtils';


// Webhook handler function
export function webhookHandler(
) {
  return async (req: Request, res: Response): Promise<void> => {
    const webhookEvent = req.body as AlchemyWebhookEvent;

    await handleIncomingEvent(webhookEvent);

    res.send('Event received');
  };
}



