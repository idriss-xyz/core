import { Router, Request, Response } from 'express';
import { CHAIN_TO_IDRISS_TIPPING_ADDRESS } from '../constants';
import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import { calculateStatsForDonorAddress } from '../utils/calculate-stats';
import { ZapperNode } from '../types';
import dotenv from 'dotenv';
import { mode } from '../utils/mode';
import { join } from 'path';

const router = Router();

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

const app_addresses = Object.values(CHAIN_TO_IDRISS_TIPPING_ADDRESS).map(
  (address) => address.toLowerCase(),
);

// Instead of fetching here with zapper again, trust that the
// donations db is complete and simply calculate the stats
router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;

    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }

    // Fetch known donations from the database
    // Fetch known donations from the database
    const knownDonations = await fetchDonationsByFromAddress(address);
    const allDonations = knownDonations.map(donation => donation.data);

    // Calculate stats using all donations
    const stats = calculateStatsForDonorAddress(allDonations);

    res.json({ data: knownDonations, stats });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
