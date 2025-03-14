import { In } from 'typeorm';

import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';
import { ZapperNode } from '../types';
import { Hex } from 'viem';

export async function storeToDatabase(
  address: Hex,
  edges: { node: ZapperNode }[],
  overwrite: boolean = false,
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

  let donationsToSave: Donation[];

  if (overwrite) {
    donationsToSave = nodes.map((node) => {
      return donationRepo.create({
        transactionHash: node.transaction.hash,
        fromAddress: node.transaction.fromUser.address.toLowerCase() as Hex,
        toAddress: address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        data: node,
      });
    });
  } else {
    const newNodes = nodes.filter((node) => {
      return !existingHashes.has(node.transaction.hash);
    });
    if (newNodes.length === 0) return;

    donationsToSave = newNodes.map((node) => {
      return donationRepo.create({
        transactionHash: node.transaction.hash,
        fromAddress: node.transaction.fromUser.address.toLowerCase() as Hex,
        toAddress: address.toLowerCase() as Hex,
        timestamp: node.timestamp,
        data: node,
      });
    });
  }

  await donationRepo.save(donationsToSave);
}
