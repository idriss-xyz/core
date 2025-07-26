import { Router, Request, Response } from 'express';

import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
import { calculateStatsForRecipientAddress } from '../utils/calculate-stats';
import { Hex } from 'viem';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DEMO_ADDRESS } from '../tests/test-data/constants';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (address && address === DEMO_ADDRESS) {
      const mockData = JSON.parse(
        readFileSync(
          resolve(__dirname, '../tests/test-data/mock-donations.json'),
          'utf-8',
        ),
      );
      const recipientDonationStats = calculateStatsForRecipientAddress(
        mockData.donations,
      );
      res.json(recipientDonationStats);
      return;
    }
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const hexAddress = address as Hex;
    const donations = await fetchDonationsByToAddress(hexAddress);
    const recipientDonationStats = calculateStatsForRecipientAddress(donations);

    res.json({
      ...recipientDonationStats,
    });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
