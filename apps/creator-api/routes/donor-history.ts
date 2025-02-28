import { Router, Request, Response } from 'express';
import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import { calculateStatsForDonorAddress } from '../utils/calculate-stats';
import dotenv from 'dotenv';
import { mode } from '../utils/mode';
import { join } from 'path';

const router = Router();

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    const knownDonations = await fetchDonationsByFromAddress(address);
    console.log('KNOWN DONATIONS', knownDonations);

    const stats = calculateStatsForDonorAddress(knownDonations);

    res.json({ stats });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
