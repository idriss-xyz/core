import { Hex } from 'viem';
import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';
import { DonationData } from '../types';

export async function fetchDonationsByToAddress(
  toAddress: Hex,
): Promise<DonationData[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ toAddress }, { toAddress: toAddress.toLowerCase() as Hex }],
    relations: ['fromUser', 'toUser', 'token'],
  });

  return donations as DonationData[];
}

export async function fetchDonationsByFromAddress(
  fromAddress: Hex,
): Promise<DonationData[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ fromAddress }, { fromAddress: fromAddress.toLowerCase() as Hex }],
    relations: ['fromUser', 'toUser', 'token'],
  });

  return donations as DonationData[];
}

export async function fetchDonations(): Promise<Record<Hex, DonationData[]>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    relations: ['fromUser', 'toUser', 'token'],
  });

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.fromAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation as DonationData);
      return acc;
    },
    {} as Record<Hex, DonationData[]>,
  );

  return groupedDonations;
}

export async function fetchDonationRecipients(): Promise<
  Record<Hex, DonationData[]>
> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    relations: ['fromUser', 'toUser', 'token'],
  });

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.toAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation as DonationData);
      return acc;
    },
    {} as Record<Hex, DonationData[]>,
  );

  return groupedDonations;
}

export async function fetchAllKnownDonationHashes(): Promise<Set<string>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    select: ['transactionHash'],
  });

  return new Set(donations.map((d) => d.transactionHash.toLowerCase()));
}
