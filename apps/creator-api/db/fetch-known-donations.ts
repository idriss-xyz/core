import { AppDataSource } from './database';
import { Donation } from './entities/donations.entity';

export async function fetchDonationsByToAddress(
  toAddress: string,
): Promise<Donation[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ toAddress }, { toAddress: toAddress.toLowerCase() }],
  });

  return donations;
}

export async function fetchDonationsByFromAddress(
  fromAddress: string,
): Promise<Donation[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({
    where: [{ fromAddress }, { fromAddress: fromAddress.toLowerCase() }],
  });

  return donations;
}

export async function fetchDonations(): Promise<Record<string, Donation[]>> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({});

  const groupedDonations = donations.reduce((acc, donation) => {
    const key = donation.fromAddress.toLowerCase();
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(donation);
    return acc;
  }, {} as Record<string, Donation[]>);

  return groupedDonations;
}
