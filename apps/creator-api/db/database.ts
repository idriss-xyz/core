import { DataSource } from 'typeorm';
import { Donation } from './entities/donations.entity';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { RestructureDonations1743174000000 } from './migrations/1743174000000-RestructureDonations';
import { AddTokenDecimals1743177600000 } from './migrations/1743177600000-AddTokenDecimals';
import { AddAmountRaw1743181200000 } from './migrations/1743181200000-AddAmountRaw';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Donation, Token, User],
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
