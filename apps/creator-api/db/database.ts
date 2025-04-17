import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../utils/mode';

import { DataSource } from 'typeorm';
import { Donation, Token, User } from './entities';
import {
  AddAmountRaw1743181200000,
  AddTokenDecimals1743177600000,
  RestructureDonations1743174000000,
} from './migrations';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../.env.${mode}`) },
);

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
