import { NextFunction } from 'express';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { SwapData } from '../types';
import { isSubscribedAddress } from '../services/subscriptionManager';
import { NULL_ADDRESS } from '../constants';
import { AlchemyWebhookEvent } from '../interfaces';
import { eventCache } from '../services/scheduler';

export function validateAlchemySignature(
  getSigningKey: (internalWebhookId: string) => Promise<string | undefined>,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rawBody = (req as any).rawBody as string;
    const signature = (req as any).signature as string | undefined;
    const internalWebhookId = req.params.internalWebhookId;

    if (!signature) {
      res.status(400).send('Invalid request: missing raw body or signature');
      return;
    }

    const signingKey = await getSigningKey(internalWebhookId);
    if (!signingKey) {
      res
        .status(403)
        .send(`No signing key found for webhookId: ${internalWebhookId}`);
      return;
    }

    if (!isValidSignatureForStringBody(rawBody, signature, signingKey)) {
      res.status(403).send('Signature validation failed, unauthorized!');
    } else {
      next();
    }
  };
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

// Function to determine if the swap is complete
export function isCompleteSwap(swapData: SwapData): boolean {
  // Check all required fields
  const requiredFields = [
    'transactionHash',
    'from',
    'to',
    'tokenIn',
    'tokenOut',
  ];

  for (const field of requiredFields) {
    if (
      swapData[field as keyof SwapData] === null ||
      swapData[field as keyof SwapData] === undefined
    ) {
      return false;
    }
    if (
      (field === 'tokenIn' || field === 'tokenOut') &&
      (swapData[field as keyof SwapData] as { amount: number })['amount'] ===
        null
    ) {
      return false;
    }
  }

  // Ensure tokenIn and tokenOut are different
  return (
    swapData.tokenIn!.address.toLowerCase() !==
    swapData.tokenOut!.address.toLowerCase()
  );
}

// Extract swap data from activities
export async function extractSwapData(
  txHash: string,
  activities: any[],
): Promise<SwapData> {
  const swapData: SwapData = {
    transactionHash: txHash,
    from: null,
    to: null,
    tokenIn: null,
    tokenOut: null,
    timestamp: new Date().toISOString(),
    isComplete: false,
  };

  for (const activity of activities) {
    const category = activity.category;

    if (category === 'external') {
      // Handle ETH transfers
      const isEthTransfer = activity.asset === 'ETH' && activity.value > 0;
      if (isEthTransfer) {
        if (
          (await isSubscribedAddress(activity.fromAddress)) &&
          !swapData.tokenOut
        ) {
          // User sent ETH (tokenOut)
          const tokenOut = {
            address: NULL_ADDRESS,
            symbol: activity.asset,
            amount: activity.value,
            decimals: activity.rawContract.decimals,
            network: activity.network,
          };
          swapData.tokenOut = tokenOut;
        }
      }
    } else if (category === 'token') {
      // Handle ERC20 token transfers
      const token = {
        address: activity.rawContract.address,
        symbol: activity.asset,
        amount: activity.value,
        decimals: activity.rawContract.decimals,
        network: activity.network,
      };
      if (
        (await isSubscribedAddress(activity.toAddress)) &&
        !swapData.tokenIn
      ) {
        // User received token (tokenIn)
        swapData.tokenIn = token;
        swapData.from = activity.toAddress;
        swapData.to = activity.fromAddress;
      } else if (
        (await isSubscribedAddress(activity.fromAddress)) &&
        !swapData.tokenOut
      ) {
        // User sent token (tokenOut)
        swapData.tokenOut = token;
        swapData.from = activity.fromAddress;
        swapData.to = activity.toAddress;
      }
    } else if (category === 'internal') {
      // User receives ETH
      const isEthTransfer = activity.asset === 'ETH' && activity.value > 0;
      if (isEthTransfer) {
        if (
          (await isSubscribedAddress(activity.toAddress)) &&
          !swapData.tokenIn
        ) {
          // User received ETH (tokenIn)
          const tokenIn = {
            address: NULL_ADDRESS,
            symbol: activity.asset,
            amount: activity.value,
            decimals: activity.rawContract.decimals,
            network: activity.network,
          };
          swapData.tokenIn = tokenIn;
          swapData.from = activity.toAddress;
          swapData.to = activity.fromAddress;
        }
      }
    }
  }

  // Check if swap is complete
  swapData.isComplete = isCompleteSwap(swapData);

  return swapData;
}

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
        activities: [],
        timestamp: Date.now(),
      };
    }
    activity.network = webhookEvent.event.network?.replace('_MAINNET', '');
    eventCache[txHash].activities.push(activity);
  }
}
