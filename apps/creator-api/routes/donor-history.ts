import { Router, Request, Response } from 'express';

import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import {
  calculateGlobalDonorLeaderboard,
  calculateStatsForDonorAddress,
  resolveCreatorAndAddresses,
} from '../utils/calculate-stats';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { createAddressToCreatorMap } from '@idriss-xyz/utils';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address: identifier } = req.body;
    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Invalid or missing identifier' });
      return;
    }

    const { addresses: allAddresses } =
      await resolveCreatorAndAddresses(identifier);

    if (allAddresses.length === 0) {
      res.status(404).json({ error: 'Creator or address not found' });
      return;
    }

    const donations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByFromAddress(addr)),
      )
    ).flat();

    const creators = await AppDataSource.getRepository(Creator).find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(creators);
    enrichDonationsWithCreatorInfo(donations, addressToCreatorMap);

    const stats = await calculateStatsForDonorAddress(donations);

    const leaderboard = await calculateGlobalDonorLeaderboard();
    const donorPosition = leaderboard.findIndex((entry) =>
      allAddresses.some((a) => a.toLowerCase() === entry.address.toLowerCase()),
    );
    stats.positionInLeaderboard =
      donorPosition !== -1 ? donorPosition + 1 : null;

    res.json({
      stats,
      donations,
    });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
