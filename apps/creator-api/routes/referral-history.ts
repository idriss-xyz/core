import { Router, Request, Response } from 'express';

import { AppDataSource } from '@idriss-xyz/db';
import { Creator, Referral } from '@idriss-xyz/db';
import { In } from 'typeorm';
import { verifyToken } from '../middleware/auth.middleware';
import {
  calculateReward,
  getAvailableRewards,
} from '../services/reward-calculating-utils';
import { tightCors } from '../config/cors';

const router = Router();

interface CreatorReferralStats {
  totalInvites: number;
  totalRewards: number;
  availableRewards: number;
  referrals: InvitedStreamersData[];
}

interface InvitedStreamersData {
  name: string;
  profilePictureUrl: string;
  numberOfFollowers: number;
  joinDate: Date;
  reward: number;
}

router.get(
  '/',
  tightCors,
  verifyToken(),
  async (req: Request, res: Response) => {
    if (!req.user?.id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const creatorRepository = AppDataSource.getRepository(Creator);
      const referrer = await creatorRepository.findOne({
        where: { privyId: req.user.id },
      });

      if (!referrer) {
        console.error('Referrer with given name does not exist');
        res
          .status(400)
          .json({ error: 'Referrer with given name does not exist' });
        return;
      }

      const referralRepository = AppDataSource.getRepository(Referral);
      const referrals = await referralRepository.find({
        where: { referrer: { id: referrer.id } },
        relations: ['referrer', 'referred'],
      });

      const totalInvites = referrals.length;
      const totalRewards = referrals.reduce(
        (sum, referral) => sum + calculateReward(referral.numberOfFollowers!),
        0,
      );
      const availableRewards = getAvailableRewards(referrals);

      const streamerIds = referrals.map((referral) => referral.referred.id);

      const streamers = await creatorRepository.find({
        where: { id: In(streamerIds) },
      });

      const streamersData = streamers.map((streamer) => {
        const referred = referrals.find(
          (referral) => referral.referred.id === streamer.id,
        );
        return {
          name: streamer.name,
          profilePictureUrl: streamer.profilePictureUrl,
          numberOfFollowers: referred?.numberOfFollowers,
          joinDate: streamer.joinedAt,
          reward: calculateReward(referred?.numberOfFollowers!),
        };
      });

      res.json({
        totalInvites,
        totalRewards,
        availableRewards,
        referrals: streamersData,
      } as CreatorReferralStats);
    } catch (error) {
      console.error('Referral history error:', error);
      res.status(500).json({ error: 'Failed to fetch referral history' });
    }
  },
);

export default router;
