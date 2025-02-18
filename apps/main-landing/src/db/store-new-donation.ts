import { In } from 'typeorm';

import { ZapperNode } from '@/app/creators/donate-history/types';

import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';

export async function storeToDatabase(
  address: string,
  edges: { node: ZapperNode }[],
) {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);
  const nodes = edges.map((edge) => {
    return edge.node;
  });
  const transactionHashes = nodes.map((node) => {
    return node.transaction.hash;
  });

  // Get already stored transaction hashes
  const existingDonations = await donationRepo.find({
    where: { transactionHash: In(transactionHashes) },
    select: ['transactionHash'],
  });
  const existingHashes = new Set(
    existingDonations.map((d) => {
      return d.transactionHash;
    }),
  );

  // Filter out nodes that are already stored
  const newNodes = nodes.filter((node) => {
    return !existingHashes.has(node.transaction.hash);
  });
  if (newNodes.length === 0) return;

  // Create new Donation entities
  const newDonations = newNodes.map((node) => {
    return donationRepo.create({
      transactionHash: node.transaction.hash,
      fromAddress: node.transaction.fromUser.address,
      toAddress: address,
      // storing timestamp as a separate column if you added it in your entity
      timestamp: node.timestamp,
      // store the full node object in the data column
      data: node,
    });
  });

  await donationRepo.save(newDonations);
}
