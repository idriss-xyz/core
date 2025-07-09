import { Router, Request, Response } from 'express';

import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
import { calculateStatsForRecipientAddress } from '../utils/calculate-stats';
import { Hex } from 'viem';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
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
