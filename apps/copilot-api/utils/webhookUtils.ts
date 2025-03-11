import { Request, Response, NextFunction } from 'express';
import * as crypto from 'crypto';
import {
  AlchemyEventHandler,
  HeliusEventHandler,
} from '../services/eventHandlers';

export function validateWebhookSignature(
  getSigningKey: (internalWebhookId: string) => Promise<string | undefined>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = (req as any).rawBody as string;
    const signature = (req as any).signature as string | undefined;
    const internalWebhookId = req.params.internalWebhookId;

    if (!signature) {
      res.status(400).send('Invalid request: missing signature');
      return;
    }

    const signingKey = await getSigningKey(internalWebhookId);
    if (!signingKey) {
      res
        .status(403)
        .send(`No signing key found for webhookId: ${internalWebhookId}`);
      return;
    }

    // Check if its neither a valid Alchemy nor Helius signature
    if (
      !isValidSignatureForStringBody(rawBody, signature, signingKey) &&
      !isValidHeliusSignature(signature, signingKey)
    ) {
      res.status(403).send('Signature validation failed, unauthorized!');
    } else {
      next();
    }
  };
}

function isValidHeliusSignature(signature: string, signingKey: string) {
  return signature === signingKey;
}

function isValidSignatureForStringBody(
  body: string,
  signature: string,
  signingKey: string,
): boolean {
  const hmac = crypto.createHmac('sha256', signingKey);
  hmac.update(body, 'utf8');
  const digest = hmac.digest('hex');
  return signature === digest;
}

