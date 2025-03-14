import { In } from 'typeorm';

import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';
import { ZapperNode } from '../types';
import { Hex } from 'viem';

export async function storeToDatabase(
  address: Hex,
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

  const existingDonations = await donationRepo.find({
    where: { transactionHash: In(transactionHashes) },
    select: ['transactionHash'],
  });
  const existingHashes = new Set(
    existingDonations.map((d) => {
      return d.transactionHash;
    }),
  );

  const newNodes = nodes.filter((node) => {
    return !existingHashes.has(node.transaction.hash);
  });
  if (newNodes.length === 0) return;

  const newDonations = newNodes.map((node) => {
    return donationRepo.create({
      transactionHash: node.transaction.hash,
      fromAddress: node.transaction.fromUser.address,
      toAddress: address,
      timestamp: node.timestamp,
      data: node,
    });
  });

  await donationRepo.save(newDonations);
}
