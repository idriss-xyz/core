import { DataSource } from 'typeorm';
import {
  Creator,
  Donation,
  DonationEffect,
  DonationParameters,
  CreatorNetwork,
  CreatorToken,
  Token,
  User,
} from './entities';
import {
  AddAmountRaw1743181200000,
  AddDonationEffects1747686797772,
  AddTokenDecimals1743177600000,
  InitialMigration1743173000000,
  RestructureDonations1743174000000,
  AddCreatorProfileEntities1747843796640,
  RefactorMuteToggles1748346009915,
} from './migrations';
import { CreatorProfileView } from './views/creator-profile.view';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [
    Donation,
    DonationEffect,
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
    InitialMigration1743173000000,
    RestructureDonations1743174000000,
    AddTokenDecimals1743177600000,
    AddAmountRaw1743181200000,
    AddDonationEffects1747686797772,
    AddCreatorProfileEntities1747843796640,
    RefactorMuteToggles1748346009915,
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
