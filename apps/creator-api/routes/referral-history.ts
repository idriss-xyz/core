import { Router, Request, Response } from 'express';

import { AppDataSource, Creator, Referral, Donation } from '@idriss-xyz/db';
import { In } from 'typeorm';
import { verifyToken } from '../middleware/auth.middleware';
import { tightCors } from '../config/cors';
import {
  fetchTwitchStreamStatus,
  fetchTwitchUserFollowersCount,
} from '@idriss-xyz/utils/server';
import { DEFAULT_FOLLOWED_CHANNELS } from '@idriss-xyz/utils/server';
import { CreatorFollowedChannel } from '@idriss-xyz/db';

const router = Router();

interface CreatorReferralStats {
  successfulInvites: number;
  successfulInvitesUsers: InvitedStreamersData[];
  inviteRank: number;
  networkEarnings: number;
  suggestedInvitees: InvitedStreamersData[];
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
        console.log('Referrer with given name does not exist');
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

      const streamerIds = referrals.map((r) => r.referred.id);
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

      const followersByCreatorId = new Map<number, number>();
      referrals.forEach((r) =>
        followersByCreatorId.set(r.referred.id, r.numberOfFollowers ?? 0),
      );

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

      const followedRepo = AppDataSource.getRepository(CreatorFollowedChannel);
      const followed = await followedRepo.find({
        where: { creator: { id: referrer.id } },
      });

      const followedIds = followed.map((r) => r.channelTwitchId);
      let existing: { tid: string }[] = [];

      if (followedIds.length > 0) {
        existing = await creatorRepository
          .createQueryBuilder('c')
          .select('c.twitch_id', 'tid')
          .where('c.is_donor = false')
          .andWhere('c.twitch_id IN (:...ids)', { ids: followedIds })
          .getRawMany<{ tid: string }>();
      }

      const existingSet = new Set(existing.map((r) => r.tid));

      const baseList =
        followed.length === 0
          ? DEFAULT_FOLLOWED_CHANNELS.filter(
              (d) => !existingSet.has(d.broadcasterId),
            ).map((d) => ({
              displayName: d.name,
              profilePictureUrl: d.profileImage,
              numberOfFollowers: d.followers,
              joinDate: new Date(0),
              streamStatus: false,
            }))
          : followed
              .filter((r) => !existingSet.has(r.channelTwitchId))
              .map((r) => ({
                displayName: r.channelDisplayName ?? r.channelName,
                profilePictureUrl: r.channelProfileImageUrl ?? '',
                numberOfFollowers: 0,
                joinDate: new Date(0),
                streamStatus: false,
              }));

      const suggestedInvitees = await Promise.all(
        baseList.map(async (c) => {
          const [stream, followers] = await Promise.all([
            fetchTwitchStreamStatus(c.displayName),
            fetchTwitchUserFollowersCount(c.displayName),
          ]);

          return {
            ...c,
            numberOfFollowers: followers?.total ?? c.numberOfFollowers,
            streamStatus: stream.isLive,
          };
        }),
      );

      res.json({
        successfulInvites,
        successfulInvitesUsers,
        inviteRank,
        networkEarnings,
        suggestedInvitees,
      } as CreatorReferralStats);
    } catch (error) {
      console.log('Referral history error:', error);
      res.status(500).json({ error: 'Failed to fetch referral history' });
    }
  },
);

export default router;
