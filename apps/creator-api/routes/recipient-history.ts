import { Router, Request, Response } from 'express';

import { calculateStatsForRecipientAddress } from '../utils/calculate-stats';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { resolveCreatorAndAddresses } from '../utils/calculate-stats';
import {
  AppDataSource,
  Creator,
  fetchDonationsByToAddress,
} from '@idriss-xyz/db';
import { enrichDonationsWithCreatorInfo } from '../utils/calculate-stats';
import { createAddressToCreatorMap } from '@idriss-xyz/utils';
import { DEMO_ADDRESS, StoredDonationData } from '@idriss-xyz/constants';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address: identifier } = req.body;
    if (identifier && identifier === DEMO_ADDRESS) {
      const mockData = JSON.parse(
        readFileSync(
          resolve(__dirname, '../tests/test-data/mock-donations.json'),
          'utf-8',
        ),
      );

      const donationsWithShiftedTimestamps = mockData.donations.map(
        (d: StoredDonationData) => ({
          ...d,
          timestamp:
            new Date(d.timestamp).setMonth(
              new Date(d.timestamp).getMonth() + 4,
            ) +
            7 * 24 * 60 * 60 * 1000,
        }),
      );

      const recipientDonationStats = calculateStatsForRecipientAddress(
        donationsWithShiftedTimestamps,
      );

      res.json(recipientDonationStats);
      return;
    }
    if (!identifier || typeof identifier !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const { addresses: allAddresses } =
      await resolveCreatorAndAddresses(identifier);

    const allDonations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByToAddress(addr)),
      )
    ).flat();

    const creators = await AppDataSource.getRepository(Creator).find({
      relations: ['associatedAddresses'],
    });
    const addressToCreatorMap = createAddressToCreatorMap(creators);
    enrichDonationsWithCreatorInfo(allDonations, addressToCreatorMap);

    const recipientDonationStats =
      calculateStatsForRecipientAddress(allDonations);

    res.json({
      ...recipientDonationStats,
    });
  } catch (error) {
    console.error('Tip history error:', error);
    res.status(500).json({ error: 'Failed to fetch tip history' });
  }
});

export default router;
