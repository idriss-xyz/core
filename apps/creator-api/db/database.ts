import { DataSource } from 'typeorm';
import { Donation, Token, User, DonationEffect } from './entities';
import {
  AddAmountRaw1743181200000,
  AddDonationEffects1747686797772,
  AddTokenDecimals1743177600000,
  RestructureDonations1743174000000,
} from './migrations';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Donation, Token, User, DonationEffect],
  synchronize: false,
  migrations: [
    RestructureDonations1743174000000,
    AddTokenDecimals1743177600000,
    AddAmountRaw1743181200000,
    AddDonationEffects1747686797772,
  ],
});

export async function initializeDatabase() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();

    const pendingMigrations = await AppDataSource.showMigrations();
    console.log('Pending migrations:', pendingMigrations);

    try {
      await AppDataSource.runMigrations();
      console.log('Migrations completed');
    } catch (error) {
      console.error('Migration failed:', error);
    }
  }
  return AppDataSource;
}
