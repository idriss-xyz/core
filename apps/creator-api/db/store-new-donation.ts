import { In } from 'typeorm';
import { formatUnits, Hex } from 'viem';

import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { ZapperNode } from '../types';
import { enrichUserData } from '../utils/enrich-user';
import { DonationData } from '@idriss-xyz/constants';

export async function storeToDatabase(
  edges: { node: ZapperNode }[],
  overwrite: boolean = false,
): Promise<DonationData[]> {
  const donationRepo = AppDataSource.getRepository(Donation);
  const userRepo = AppDataSource.getRepository(User);
  const tokenRepo = AppDataSource.getRepository(Token);
  const savedDonations: DonationData[] = [];

  const nodes = edges.map((edge) => edge.node);
  const transactionHashes = nodes.map((node) => node.transaction.hash);

  const existingDonations = await donationRepo.find({
    where: { transactionHash: In(transactionHashes) },
    select: ['transactionHash'],
  });
  const existingHashes = new Set(
    existingDonations.map((d) => d.transactionHash),
  );
  const enrichedUserCache = new Map<Hex, any>();

  for (const node of nodes) {
    if (!overwrite && existingHashes.has(node.transaction.hash)) {
      continue;
    }
    const fromUser = node.transaction.fromUser;
    const fromAddress = fromUser.address.toLowerCase() as Hex;
    let enrichedFromUser = enrichedUserCache.get(fromAddress);
    if (!enrichedFromUser) {
      enrichedFromUser = await enrichUserData({
        address: fromAddress,
        displayName: fromUser.displayName?.value,
        displayNameSource: fromUser.displayName?.source,
        avatarUrl: fromUser.avatar?.value?.url,
        avatarSource: fromUser.avatar?.source,
        farcasterUserData: fromUser.farcasterProfile,
      });
      enrichedUserCache.set(fromAddress, enrichedFromUser);
      await userRepo.upsert(enrichedFromUser, {
        conflictPaths: ['address'],
        skipUpdateIfNoValuesChanged: true,
      });
    }

    const toUser = node.interpretation.descriptionDisplayItems[1]?.account;
    let enrichedToUser: typeof enrichedFromUser | undefined;

    if (!toUser?.address) {
      continue;
    }

    if (toUser) {
      const toAddress = toUser.address.toLowerCase() as Hex;
      enrichedToUser = enrichedUserCache.get(toAddress);
      if (!enrichedToUser) {
        enrichedToUser = await enrichUserData({
          address: toAddress,
          displayName: toUser.displayName?.value,
          displayNameSource: toUser.displayName?.source,
          avatarUrl: toUser.avatar?.value?.url,
          avatarSource: toUser.avatar?.source,
          farcasterUserData: toUser.farcasterProfile,
        });
        enrichedUserCache.set(toAddress, enrichedToUser);
        await userRepo.upsert(enrichedToUser, {
          conflictPaths: ['address'],
          skipUpdateIfNoValuesChanged: true,
        });
      }
    }

    const tokenData = node.interpretation.descriptionDisplayItems[0]?.tokenV2;
    if (tokenData) {
      const existingToken = await tokenRepo.findOneBy({
        address: tokenData.address.toLowerCase() as Hex,
        network: node.network,
      });

      if (!existingToken) {
        await tokenRepo.save({
          address: tokenData.address.toLowerCase() as Hex,
          symbol: tokenData.symbol,
          imageUrl: tokenData.imageUrlV2,
          network: node.network,
          decimals: tokenData.decimals,
          name: tokenData.name,
        });
      }

      const amountRaw =
        node.interpretation.descriptionDisplayItems[0]?.amountRaw || '0';
      const tradeValue = tokenData.priceData?.price
        ? Number(formatUnits(BigInt(amountRaw), tokenData.decimals)) *
          tokenData.priceData.price
        : 0;

      const savedDonation = await donationRepo.save({
        transactionHash: node.transaction.hash,
        fromAddress: fromUser.address.toLowerCase() as Hex,
        toAddress: toUser.address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        comment: node.interpretation.descriptionDisplayItems[2]?.stringValue,
        tradeValue,
        tokenAddress: tokenData.address.toLowerCase() as Hex,
        network: node.network,
        data: node,
        amountRaw,
        fromUser: enrichedFromUser,
        toUser: enrichedToUser,
        token: {
          address: tokenData.address.toLowerCase() as Hex,
          symbol: tokenData.symbol,
          imageUrl: tokenData.imageUrlV2,
          network: node.network,
          decimals: tokenData.decimals,
        },
      });
      savedDonations.push(savedDonation);
    }
  }
  return savedDonations;
}
