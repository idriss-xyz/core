import { Router, Request, Response } from 'express';

interface LeaderboardStats {
  address: string;
  totalDonations: number;
  totalAmount: number;
}

async function calculateGlobalDonorLeaderboard(): Promise<LeaderboardStats[]> {
  const groupedDonations = await fetchDonations();

  const leaderboard = Object.entries(groupedDonations).map(([address, donations]) => ({
    address,
    totalDonations: donations.length,
    totalAmount: donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0),
  }));

  // Sort the leaderboard by totalAmount in descending order
  leaderboard.sort((a, b) => b.totalAmount - a.totalAmount);

  return leaderboard;
}
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
    const leaderboard = await calculateGlobalDonorLeaderboard();
    const stats = calculateStatsForDonorAddress(knownDonations);

    res.json({ stats, leaderboard });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
