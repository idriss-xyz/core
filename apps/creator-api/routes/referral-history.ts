import { Router, Request, Response } from 'express';

import { AppDataSource } from '../db/database';
import { Creator, Referral } from '../db/entities';
import { In } from 'typeorm';
import { verifyToken } from '../db/middleware/auth.middleware';
import { Hex } from 'viem';

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

router.get('/:address', verifyToken(), async (req: Request, res: Response) => {
  try {
    const address = req.params.address;
    if (!address) {
      console.error('Invalid creator address provided');
      res.status(400).json({ error: 'Invalid creator address provided' });
      return;
    }

    const hexAddress = address as Hex;

    const creatorRepository = AppDataSource.getRepository(Creator);

    const referrer = await creatorRepository.findOne({
      where: { address: hexAddress },
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
      (sum, referral) => sum + referral.reward,
      0,
    );
    const availableRewards = referrals
      .filter((referral) => !referral.credited)
      .reduce((sum, referral) => sum + referral.reward, 0);

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
        reward: referred?.reward,
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
});

export default router;
