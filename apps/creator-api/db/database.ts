import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { join } from 'path';

import { mode } from '../utils/mode';

import { Donation } from './entities/donations.entity';

dotenv.config(
  mode === 'production' ? {} : { path: join(__dirname, `../.env.${mode}`) },
);

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Donation],
  synchronize: true,
});
