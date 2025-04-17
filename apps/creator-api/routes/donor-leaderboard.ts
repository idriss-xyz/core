import { Router, Request, Response } from 'express';

import { calculateGlobalDonorLeaderboard } from '../utils/calculate-stats';
import dotenv from 'dotenv';
import { mode } from '../utils/mode';
import { join } from 'path';

const router = Router();

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `.env.${mode}`) },
);

router.get('/', async (req: Request, res: Response) => {
  try {
    const leaderboard = await calculateGlobalDonorLeaderboard();

    res.json({
      leaderboard,
    });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
