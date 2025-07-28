import { Router, Request, Response } from 'express';
import { AppDataSource } from '../db/database';
import { Creator, Referral } from '../db/entities';

import { verifyToken } from '../db/middleware/auth.middleware';
import { fetchTwitchUserFollowersCount } from '../utils/twitch-api';
import { creatorProfileService } from '../services/creator-profile.service';

const router = Router();

router.post('/:name', verifyToken(), async (req: Request, res: Response) => {
  const referrerName = req.params.name;
  if (!referrerName) {
    console.error('No referrer name provided');
    throw new Error('No referrer name provided');
  }

  const referredName = req.body.name;

  if (!referredName) {
    console.error('No referred name provided');
    throw new Error('No referred name provided');
  }

  if (referrerName === referredName) {
    console.error('Self invites are not allowed!');
    throw new Error('Self invites are not allowed!');
  }

  try {
    await creatorProfileService.createCreatorProfile(req);
  } catch (error) {
    console.error('Error creating creator profile:', error);
    res.status(500).json({ error: 'Failed to create creator profile' });
  }

  const creatorRepository = AppDataSource.getRepository(Creator);
  const referralRepository = AppDataSource.getRepository(Referral);

  const referrer = await creatorRepository.findOne({
    where: { name: referrerName },
  });

  if (!referrer) {
    console.error('Referrer with given name does not exist');
    throw new Error('Referrer with given name does not exist');
  }

  const referred = await creatorRepository.findOne({
    where: { name: referredName },
  });

  if (!referred) {
    console.error('Referred with given name does not exist');
    throw new Error('Referred with given name does not exist');
  }

  const twitchUserFollowersInfo =
    await fetchTwitchUserFollowersCount(referredName);

  const followersCount = twitchUserFollowersInfo
    ? twitchUserFollowersInfo.total
    : 0;

  const reward = calculateReward(followersCount);

  const referral = new Referral();
  referral.credited = false;
  referral.referrer = referrer;
  referral.referred = referred;
  referral.reward = reward;
  referral.numberOfFollowers = followersCount;

  await referralRepository.save(referral);

  res.status(201).json({
    message: 'Success',
  });
});

const calculateReward = (followersCount: number) => {
  let reward;

  switch (true) {
    case followersCount >= 100_000:
      reward = 25;
      break;
    case followersCount >= 10_000:
      reward = 20;
      break;
    case followersCount >= 1_000:
      reward = 15;
      break;
    case followersCount >= 100:
      reward = 10;
      break;
    default:
      reward = 0;
      break;
  }
  return reward;
};

export default router;
