import { Router, Request, Response } from 'express';

import { fetchDonationsByFromAddress } from '../db/fetch-known-donations';
import {
  calculateGlobalDonorLeaderboard,
  calculateStatsForDonor,
  resolveCreatorAndAddresses,
} from '../utils/calculate-stats';
import { AppDataSource } from '../db/database';
import { Creator } from '../db/entities';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { createAddressToCreatorMap } from '@idriss-xyz/utils';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { name } = req.query;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Invalid or missing name parameter' });
      return;
    }

    const { addresses: allAddresses } = await resolveCreatorAndAddresses(name);

    if (allAddresses.length === 0) {
      res.status(404).json({ error: 'Creator not found' });
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

    const stats = await calculateStatsForDonor(donations, name);

    // ── inject fresh avatar from Creator table
    const donorCreator = allAddresses
      .map((addr) => addressToCreatorMap.get(addr.toLowerCase()))
      .find(Boolean);
    if (donorCreator?.profilePictureUrl)
      stats.donorAvatarUrl = donorCreator.profilePictureUrl;

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
    console.error('Donor history error:', error);
    res.status(500).json({ error: 'Failed to fetch donor history' });
  }
});

export default router;
