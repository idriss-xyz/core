import { Router, Request, Response } from 'express';

import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import {
  calculateGlobalDonorLeaderboard,
  calculateStatsForDonorAddress,
} from '../utils/calculate-stats';
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
    const stats = calculateStatsForDonorAddress(knownDonations);

    const leaderboard = await calculateGlobalDonorLeaderboard();
    const donorPosition = leaderboard.findIndex((entry) => entry.address.toLowerCase() === address.toLowerCase()) + 1;

    res.json({ 
      stats, 
      leaderboard,
      donorPosition: donorPosition || null
    });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
