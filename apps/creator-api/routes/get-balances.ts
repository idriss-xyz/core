import { Router, Request, Response } from 'express';
import { isAddress } from 'viem';
import { calculateBalances } from '../utils/calculate-balances';

const router = Router();

router.get('/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  if (!address || !isAddress(address)) {
    res.status(400).json({ error: 'A valid wallet address is required' });
    return;
  }

  try {
    const result = await calculateBalances(address);

    res.json(result);
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

export default router;
