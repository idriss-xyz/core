import { MigrationInterface, QueryRunner } from 'typeorm';
import { mode } from '../../utils/mode';

export class InitialMigration1743173000000 implements MigrationInterface {
  name = 'InitialMigration1743173000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if this is a development environment
    // You can add an environment check here if needed
    const isDevEnvironment = mode === 'development';

    if (!isDevEnvironment) {
      console.log('Skipping InitialDevSetup migration in non-development environment');
      return;
    }

    // Create basic creator_donations table
    const creatorDonationsExists = await queryRunner.hasTable('creator_donations');
    if (!creatorDonationsExists) {
      await queryRunner.query(`
        CREATE TABLE "creator_donations" (
          "transaction_hash" text PRIMARY KEY,
          "from_address" text,
          "to_address" text,
          "data" json
        );
      `);
      console.log('Created creator_donations table');
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Only run in development environment
    const isDevEnvironment = mode === 'development';

    if (!isDevEnvironment) {
      console.log('Skipping InitialDevSetup down migration in non-development environment');
      return;
    }
    await queryRunner.query(`DROP TABLE IF EXISTS "creator_donations"`);
  }
}
