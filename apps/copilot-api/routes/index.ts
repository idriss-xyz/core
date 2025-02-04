import express from 'express';
import { throwInternalError } from '../middleware/error.middleware';
import {
  subscribeAddress,
  unsubscribeAddress,
} from '../services/subscriptionManager';
import { verifyToken } from '../middleware/auth.middleware';
import { getQuote } from '@lifi/sdk';
import { connectedClients } from '../services/scheduler';
import { dataSource } from '../db';
import { SubscriptionsEntity } from '../entities/subscribtions.entity';

const subscriptionsRepo = dataSource.getRepository(SubscriptionsEntity);

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).send('Express');
});

router.post('/subscribe', verifyToken(), async (req, res) => {
  const { fid, address, chainType } = req.body;

  const { id: subscriberId } = req.user;

  if (!address) {
    res.status(400).json({ error: 'subscriberId and address are required' });
    return;
  }

  try {
    await subscribeAddress(subscriberId, address, chainType, fid);

    res
      .status(200)
      .json({ message: `Subscribed ${subscriberId} to ${address}` });
  } catch (err) {
    throwInternalError(res, 'Error subscribing address', err);
  }
});

router.post('/unsubscribe', verifyToken(), async (req, res) => {
  const { address, chainType } = req.body;

  const { id: subscriberId } = req.user;

  if (!address) {
    res.status(400).json({ error: 'subscriberId and address are required' });
    return;
  }

  try {
    await unsubscribeAddress(subscriberId, address, chainType);

    res
      .status(200)
      .json({ message: `Unsubscribed ${subscriberId} to ${address}` });
  } catch (err) {
    throwInternalError(res, 'Error unsubscribing address', err);
  }
});

router.get('/test-swap/:subscriberId', async (req, res) => {
  const { subscriberId } = req.params || {};

  const swapData = {
    transactionHash:
      '0xcbe526713e8c2095369191287c1fd4c1832716a55abe0b58db7ee91bebe21542',
    from: '0x4a3755eb99ae8b22aafb8f16f0c51cf68eb60b85',
    to: '0x1231deb6f5749ef6ce6943a275a1d3e7486f4eae',
    tokenIn: {
      address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
      symbol: 'DEGEN',
      amount: 357.09,
      decimals: 18,
      network: 'BASE',
    },
    tokenOut: {
      address: '0x4200000000000000000000000000000000000006',
      symbol: 'WETH',
      amount: 0.001,
      decimals: 18,
      network: 'BASE',
    },
    timestamp: '2024-10-28T16:13:17.698Z',
    isComplete: true,
  };

  // Validate swapData here if necessary
  if (!swapData || !swapData.isComplete) {
    res.status(400).json({ error: 'Invalid swap data' });
    return;
  }

  try {
    const clientSocket = connectedClients.get(subscriberId);
    if (clientSocket) {
      clientSocket.emit('swapEvent', swapData);
    }

    res.status(200).json({ message: `Swap event sent to ${subscriberId}` });
  } catch (err) {
    throwInternalError(res, 'Error sending swap event', err);
  }
});

router.post('/get-quote', async (req, res) => {
  const {
    fromAddress,
    originChain,
    destinationChain,
    originToken,
    destinationToken,
    amount,
  } = req.body;

  // Validate required parameters
  if (
    !originChain ||
    !destinationChain ||
    !originToken ||
    !destinationToken ||
    !amount
  ) {
    res.status(400).json({
      success: false,
      message: 'Missing required parameters',
    });
  }

  try {
    const quote = await getQuote({
      fromAddress,
      fromChain: originChain,
      toChain: destinationChain,
      fromToken: originToken,
      toToken: destinationToken,
      fromAmount: amount,
    });

    const quoteResult = {
      success: true,
      estimate: quote.estimate,
      type: quote.type, // for debugging purposes
      tool: quote.tool, // for debugging purposes
      includedSteps: quote.includedSteps, // for debugging purposes
      transactionData: quote.transactionRequest,
    };

    res.status(200).json(quoteResult);
  } catch (err) {
    console.error('Error getting quote: ' + err);
    res.status(429).json({ error: 'You reach Lifi limit' });
  }
});

router.get('/top-addresses', async (req, res) => {
  const { secret } = req.query;
  if (secret !== process.env.TOP_ADDRESSES_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const data = await subscriptionsRepo
    .createQueryBuilder()
    .select(['address', 'CAST(COUNT(subscriber_id) AS INTEGER) as count'])
    .groupBy('address')
    .orderBy('count', 'DESC')
    .limit(10)
    .getRawMany();
  res.status(200).json(data);
});
export default router;
