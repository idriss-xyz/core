import { DataSource } from 'typeorm';
import {
  Creator,
  Donation,
  DonationParameters,
  CreatorNetwork,
  CreatorToken,
  Token,
  User,
} from './entities';
import {
  AddAmountRaw1743181200000,
  AddTokenDecimals1743177600000,
  RestructureDonations1743174000000,
} from './migrations';
import { CreatorProfileView } from './views/creator-profile.view';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Donation,
    Token,
    User,
    Creator,
    CreatorNetwork,
    CreatorToken,
    DonationParameters,
    CreatorProfileView,
  ],
  synchronize: false,
  migrations: [
    RestructureDonations1743174000000,
    AddTokenDecimals1743177600000,
    AddAmountRaw1743181200000,
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
