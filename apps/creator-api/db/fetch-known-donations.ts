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

// ai! make it so this function groups the return by fromAddress, so I can calculate the donationn stats for every address that ever donated
export async function fetchDonations(): Promise<Donation[]> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const donationRepo = AppDataSource.getRepository(Donation);

  const donations = await donationRepo.find({});

  return donations;
}
