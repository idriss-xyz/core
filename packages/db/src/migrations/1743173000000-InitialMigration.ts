import { MigrationInterface, QueryRunner } from 'typeorm';

const mode =
  process?.argv
    ?.find((argument) => {
      return argument.includes('--mode');
    })
    ?.split('=')?.[1] ?? 'production';

export class InitialMigration1743173000000 implements MigrationInterface {
  name = 'InitialMigration1743173000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const isDevelopmentEnvironment = mode === 'development';

    if (!isDevelopmentEnvironment) {
      console.log(
        'Skipping InitialMigration migration in non-development environment',
      );
      return;
    }

    // Create basic creator_donations table
    const creatorDonationsExists =
      await queryRunner.hasTable('creator_donations');
    if (!creatorDonationsExists) {
      await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "creator_donations" (
          "transaction_hash" text PRIMARY KEY,
          "from_address" text,
          "to_address" text,
          "data" json
        );
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const isDevelopmentEnvironment = mode === 'development';

    if (!isDevelopmentEnvironment) {
      console.log(
        'Skipping InitialMigration down migration in non-development environment',
      );
      return;
    }
    await queryRunner.query(`DROP TABLE IF EXISTS "creator_donations"`);
  }
}
