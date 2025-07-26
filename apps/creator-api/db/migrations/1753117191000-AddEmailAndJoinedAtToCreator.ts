import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailAndJoinedAtToCreator1753117191000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator"
      ADD COLUMN IF NOT EXISTS "email" text;
    `);
    await queryRunner.query(`
      ALTER TABLE "creator"
      ADD COLUMN IF NOT EXISTS "joined_at" timestamp with time zone NOT NULL DEFAULT now();
    `);
    // Add unique constraint separately to avoid issues if column already exists.
    // This will fail if non-unique emails are already present.
    await queryRunner.query(`
      ALTER TABLE "creator"
      ADD CONSTRAINT "UQ_creator_email" UNIQUE (email);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator"
      DROP CONSTRAINT IF EXISTS "UQ_creator_email";
    `);
    await queryRunner.query(`
      ALTER TABLE "creator"
      DROP COLUMN IF EXISTS "email";
    `);
    await queryRunner.query(`
      ALTER TABLE "creator"
      DROP COLUMN IF EXISTS "joined_at";
    `);
  }
}
