import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountRaw1743181200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add amountRaw column
    await queryRunner.query(`
      ALTER TABLE "creator_donations"
      ADD COLUMN "amount_raw" text NOT NULL DEFAULT '0'
    `);

    // Update existing rows with amountRaw from data
    const donations = await queryRunner.query(`
      SELECT transaction_hash, data
      FROM creator_donations
    `);

    for (const donation of donations) {
      const amountRaw =
        donation.data.interpretation?.descriptionDisplayItems?.[0]?.amountRaw ||
        '0';

      await queryRunner.query(
        `
        UPDATE "creator_donations"
        SET amount_raw = $1
        WHERE transaction_hash = $2
        `,
        [amountRaw, donation.transaction_hash],
      );
    }

    // Remove the default value constraint
    await queryRunner.query(`
      ALTER TABLE "creator_donations"
      ALTER COLUMN "amount_raw" DROP DEFAULT
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "creator_donations"
      DROP COLUMN IF EXISTS "amount_raw"
    `);
  }
}
