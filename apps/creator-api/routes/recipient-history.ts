import { Router, Request, Response } from 'express';

import { fetchDonationsByToAddress } from '../db/fetch-known-donations';
import { calculateStatsForRecipientAddress } from '../utils/calculate-stats';
import { Hex } from 'viem';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { DEMO_ADDRESS } from '../tests/test-data/constants';
import { AppDataSource } from '../db/database';
import { Creator, CreatorAddress } from '../db/entities';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  try {
    const { address } = req.body;
    if (address && address === DEMO_ADDRESS) {
      const mockData = JSON.parse(
        readFileSync(
          resolve(__dirname, '../tests/test-data/mock-donations.json'),
          'utf-8',
        ),
      );
      const recipientDonationStats = calculateStatsForRecipientAddress(
        mockData.donations,
      );
      res.json(recipientDonationStats);
      return;
    }
    if (!address || typeof address !== 'string') {
      res.status(400).json({ error: 'Invalid or missing address' });
      return;
    }
    const hexAddress = address as Hex;

    const creatorRepository = AppDataSource.getRepository(Creator);
    const creatorAddressRepository =
      AppDataSource.getRepository(CreatorAddress);

    let creator = await creatorRepository.findOne({
      where: { address: hexAddress },
      relations: ['associatedAddresses'],
    });

    if (!creator) {
      const secondaryAddress = await creatorAddressRepository.findOne({
        where: { address: hexAddress },
        relations: ['creator', 'creator.associatedAddresses'],
      });
      creator = secondaryAddress?.creator;
    }

    const allAddresses = creator
      ? [creator.address, ...creator.associatedAddresses.map((a) => a.address)]
      : [hexAddress];

    const allDonations = (
      await Promise.all(
        allAddresses.map((addr) => fetchDonationsByToAddress(addr)),
      )
    ).flat();

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
