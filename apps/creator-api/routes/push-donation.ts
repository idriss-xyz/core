import { Request, Response } from 'express';
import express from 'express';
import { processNewDonations } from '../services/zapper/process-donations';
import { connectedClients } from '../services/socket-server';
import { DonationData } from '../types';
import { Hex } from 'viem';

const router = express.Router();
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MAX_RETRIES = 6;
const RETRY_INTERVAL = 5000;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    const hexAddress = address as Hex;

    let retries = 0;
    let result = <{ storedDonations: DonationData[] }>(
      await delay(RETRY_INTERVAL)
    );

    while (retries < MAX_RETRIES) {
      result = await processNewDonations(hexAddress);

      if (result.storedDonations.length > 0) {
        break;
      }

      retries++;

      await delay(RETRY_INTERVAL);
    }

    if (result.storedDonations.length > 0) {
      const clients = connectedClients.get(address);
      if (clients) {
        for (const donation of result.storedDonations) {
          for (const socket of clients) {
            socket.emit('newDonation', donation);
          }
        }
      }

      res.json({ data: result.storedDonations });
    } else {
      res.status(200).json({ message: 'No new donations found after retries' });
    }
  } catch (error) {
    console.error('Donation update error:', error);
    res.status(500).json({ error: 'Failed to update donation data' });
  }
});

export default router;
