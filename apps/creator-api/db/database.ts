import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../utils/mode';

import { DataSource } from 'typeorm';
import { Donation } from './entities/donations.entity';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { RestructureDonations } from './migrations/1-RestructureDonations';
import { AddTokenDecimals } from './migrations/2-AddTokenDecimals';
import { AddAmountRaw } from './migrations/3-AddAmountRaw';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../.env.${mode}`) },
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Donation, Token, User],
  synchronize: false,
  migrations: [RestructureDonations, AddTokenDecimals, AddAmountRaw],
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
