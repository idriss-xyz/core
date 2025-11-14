import { Router, Request, Response } from 'express';

import { creatorProfileService } from '../services/creator-profile.service';
import { Hex } from 'viem';
import { tightCors } from '../config/cors';
import { verifyToken } from '../middleware/auth.middleware';
import { AppDataSource, Creator, Referral } from '@idriss-xyz/db';
import { fetchTwitchUserFollowersCount } from '@idriss-xyz/utils/server';

const router = Router();

router.post(
  '/:referrerAddress',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const referrerAddress = req.params.referrerAddress;
    if (!referrerAddress) {
      console.error('Invalid referrer address provided');
      res.status(400).json({ error: 'Invalid referrer address provided' });
      return;
    }

    const hexReferrerAddress = referrerAddress as Hex;
    const referredAddress = req.body.address;
    if (!referredAddress) {
      console.error('Invalid referred address provided');
      res.status(400).json({ error: 'Invalid referred address provided' });
      return;
    }

    const hexReferredAddress = referredAddress as Hex;
    if (hexReferrerAddress === hexReferredAddress) {
      console.error('Self invites are not allowed');
      res.status(400).json({ error: 'Self invites are not allowed' });
      return;
    }

    let savedCreator;
    let savedDonationParameters;

    try {
      const result = await creatorProfileService.createCreatorProfile(req);
      savedCreator = result.savedCreator;
      savedDonationParameters = result.savedDonationParameters;
    } catch (error) {
      console.error('Error creating creator profile:', error);
      res.status(500).json({ error: 'Failed to create creator profile' });
      return;
    }

    const creatorRepository = AppDataSource.getRepository(Creator);
    const referralRepository = AppDataSource.getRepository(Referral);

    const referrer = await creatorRepository.findOne({
      where: { address: hexReferrerAddress },
    });

    if (!referrer) {
      console.error('Referrer with given address does not exist');
      res
        .status(400)
        .json({ error: 'Referrer with given address does not exist' });
      return;
    }

    const referred = savedCreator;

    const twitchUserFollowersInfo = await fetchTwitchUserFollowersCount(
      referred.name,
    );
    const followersCount = twitchUserFollowersInfo
      ? twitchUserFollowersInfo.total
      : 0;

    const referral = new Referral();
    referral.credited = false;
    referral.referrer = referrer;
    referral.referred = referred;
    referral.numberOfFollowers = followersCount;

    await referralRepository.save(referral);

    res.status(201).json({
      creator: {
        ...savedCreator,
        donationParameters: savedDonationParameters,
      },
    });
  },
);

export default router;
