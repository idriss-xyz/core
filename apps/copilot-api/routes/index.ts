import express from 'express';
import rateLimit from 'express-rate-limit';
import { testSwapData } from '../constants';
import { verifyToken } from '../middleware/auth.middleware';
import { throwInternalError } from '../middleware/error.middleware';
import { getQuoteData, getStats, getTopAddresses } from '../services';
import { connectedClients } from '../services/scheduler';
import {
  subscribeAddress,
  unsubscribeAddress,
} from '../services/subscriptionManager';
import {
  GetQuoteDataResponseInterface,
  StatsResponseInterface,
  TopAddressesResponseInterface,
} from '../types';

const requestLimitation = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

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
  const { subscriberId } = req.params;
  const { secret } = req.query;

  if (secret !== process.env.API_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  // Validate swapData here if necessary
  if (!testSwapData || !testSwapData.isComplete) {
    res.status(400).json({ error: 'Invalid swap data' });
    return;
  }

  try {
    const clientSocket = connectedClients.get(subscriberId);
    if (clientSocket) {
      clientSocket.emit('swapEvent', testSwapData);
    }

    res.status(200).json({ message: `Swap event sent to ${subscriberId}` });
  } catch (err) {
    throwInternalError(res, 'Error sending swap event', err);
  }
});

router.post('/get-quote', requestLimitation, async (req, res) => {
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
    const quoteResult: GetQuoteDataResponseInterface = await getQuoteData({
      amount,
      fromAddress,
      destinationChain,
      destinationToken,
      originChain,
      originToken,
    });
    res.status(200).json(quoteResult);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

router.get('/top-addresses', async (req, res) => {
  const { secret } = req.query;
  if (secret !== process.env.TOP_ADDRESSES_SECRET) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const data: TopAddressesResponseInterface[] = await getTopAddresses();
  const stats: StatsResponseInterface = await getStats();
  res.status(200).json({ stats, 'top-subscribed-addresses': data });
});

export default router;
