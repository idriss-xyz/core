import { Hex } from 'viem';
import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';

export async function fetchDonationsByToAddress(
  toAddress: Hex,
): Promise<Donation[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ toAddress }, { toAddress: toAddress.toLowerCase() as Hex }],
  });

  return donations;
}

export async function fetchDonationsByFromAddress(
  fromAddress: Hex,
): Promise<Donation[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ fromAddress }, { fromAddress: fromAddress.toLowerCase() as Hex }],
  });

  return donations;
}

export async function fetchDonations(): Promise<Record<Hex, Donation[]>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({});

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.fromAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    },
    {} as Record<Hex, Donation[]>,
  );

  return groupedDonations;
}

export async function fetchDonationRecipients(): Promise<
  Record<Hex, Donation[]>
> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({});

  const groupedDonations = donations.reduce(
    (acc, donation) => {
      const key = donation.toAddress.toLowerCase() as Hex;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(donation);
      return acc;
    },
    {} as Record<Hex, Donation[]>,
  );

  return groupedDonations;
}
