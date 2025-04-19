import { Router, Request, Response } from 'express';

import { calculateGlobalDonorLeaderboard } from '../utils/calculate-stats';

const router = Router();

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
