import { DataSource } from 'typeorm';

import { Donation } from './entities/donations.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [Donation],
  synchronize: true,
});
