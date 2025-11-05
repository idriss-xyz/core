import { Router, Request, Response } from 'express';

import { AppDataSource, Creator, Referral, Donation } from '@idriss-xyz/db';
import { In } from 'typeorm';
import { verifyToken } from '../middleware/auth.middleware';
import { tightCors } from '../config/cors';
import { fetchTwitchStreamStatus } from '@idriss-xyz/utils/server';

const router = Router();

interface CreatorReferralStats {
  successfulInvites: number;
  successfulInvitesUsers: InvitedStreamersData[];
  inviteRank: number;
  networkEarnings: number;
}

interface InvitedStreamersData {
  displayName: string;
  profilePictureUrl: string;
  numberOfFollowers: number;
  joinDate: Date;
  streamStatus: boolean;
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

      const successfulInvites = referrals.length;

      /* ----- invited creators (avatar + display-name) ----- */
      const streamerIds = referrals.map((referral) => referral.referred.id);
      const streamers = await creatorRepository.find({
        where: { id: In(streamerIds) },
        select: [
          'id',
          'displayName',
          'profilePictureUrl',
          'primaryAddress',
          'joinedAt',
        ],
      });

      /* map creatorId → numberOfFollowers coming from Referral rows */
      const followersByCreatorId = new Map<number, number>();
      referrals.forEach((r) =>
        followersByCreatorId.set(r.referred.id, r.numberOfFollowers ?? 0),
      );

      /*  fetch live / offline status for every streamer in parallel  */
      const streamStatuses = await Promise.all(
        streamers.map(async (s) => {
          try {
            const { isLive } = await fetchTwitchStreamStatus(s.displayName);
            return isLive;
          } catch {
            return false;
          }
        }),
      );

      const successfulInvitesUsers: InvitedStreamersData[] = streamers.map(
        ({ id, displayName, profilePictureUrl, joinedAt }, idx) => ({
          displayName,
          profilePictureUrl: profilePictureUrl ?? '',
          numberOfFollowers: followersByCreatorId.get(id) ?? 0,
          joinDate: joinedAt,
          streamStatus: streamStatuses[idx],
        }),
      );

      /* ----- network earnings (Σ donations to all invited creators) ----- */
      let networkEarnings = 0;
      if (streamers.length) {
        const donationRepository = AppDataSource.getRepository(Donation);
        const result = await donationRepository
          .createQueryBuilder('d')
          .select('COALESCE(SUM(d.trade_value), 0)', 'total')
          .where('LOWER(d.to_address) IN (:...addresses)', {
            addresses: streamers.map((s) => s.primaryAddress.toLowerCase()),
          })
          .getRawOne<{ total: string }>();

        networkEarnings = Number(result?.total ?? 0);
      }

      /* ----- invite rank (by successfulInvites) ----- */
      const globalInviteCounts = await referralRepository
        .createQueryBuilder('r')
        .leftJoin('r.referrer', 'ref')
        .select('ref.id', 'referrerId')
        .addSelect('COUNT(r.id)', 'invite_count')
        .groupBy('ref.id')
        .orderBy('invite_count', 'DESC')
        .getRawMany<{ referrerId: string; invite_count: string }>();

      const inviteRank =
        globalInviteCounts.findIndex(
          (row) => Number(row.referrerId) === referrer.id,
        ) + 1;

      res.json({
        successfulInvites,
        successfulInvitesUsers,
        inviteRank,
        networkEarnings,
      } as CreatorReferralStats);
    } catch (error) {
      console.error('Referral history error:', error);
      res.status(500).json({ error: 'Failed to fetch referral history' });
    }
  },
);

export default router;
