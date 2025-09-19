import { Router, Request, Response } from 'express';
import { isAddress } from 'viem';
import {
  calculateBalances,
  calculateNftBalances,
} from '../utils/calculate-balances';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DEMO_ADDRESS } from '@idriss-xyz/constants';

const router = Router();

router.get('/:address', async (req: Request, res: Response) => {
  const { address } = req.params;

  if (address && address === DEMO_ADDRESS) {
    const mockBalances = JSON.parse(
      readFileSync(
        resolve(__dirname, '../tests/test-data/mock-balances.json'),
        'utf-8',
      ),
    );
    res.json(mockBalances);
    return;
  }

  if (!address || !isAddress(address)) {
    res.status(400).json({ error: 'A valid wallet address is required' });
    return;
  }

  try {
    const tokenResult = await calculateBalances(address);
    res.json({ tokenResult });
  } catch (error) {
    console.error('Get balances error:', error);
    res.status(500).json({ error: 'Failed to fetch balances' });
  }
});

router.get('/nft/:address', async (req: Request, res: Response) => {
  const { address } = req.params;
  const { includePrices } = req.query;
  const withPrices = includePrices === 'true';

  if (address && address === DEMO_ADDRESS) {
    const mockBalances = JSON.parse(
      readFileSync(
        resolve(__dirname, '../tests/test-data/mock-balances.json'),
        'utf-8',
      ),
    );
    res.json({ nftResult: { balances: mockBalances.nfts } });
    return;
  }

  if (!address || !isAddress(address)) {
    res.status(400).json({ error: 'A valid wallet address is required' });
    return;
  }

  try {
    const nftResult = await calculateNftBalances(address, withPrices);
    res.json({ nftResult });
  } catch (error) {
    console.error('Get NFT balances error:', error);
    res.status(500).json({ error: 'Failed to fetch NFT balances' });
  }
});

export default router;
