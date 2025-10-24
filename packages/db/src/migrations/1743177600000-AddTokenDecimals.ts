import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTokenDecimals1743177600000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add decimals column if it doesn't exist
    await queryRunner.query(`
      ALTER TABLE "tokens"
      ADD COLUMN IF NOT EXISTS "decimals" integer NOT NULL DEFAULT 18
    `);

    // Update decimals from data column
    const donations = await queryRunner.query(`
      SELECT DISTINCT ON (d.token_address, d.network)
        d.token_address,
        d.network,
        d.data
      FROM creator_donations d
    `);

    for (const donation of donations) {
      const decimals =
        donation.data.interpretation?.descriptionDisplayItems?.[0]?.tokenV2
          ?.decimals ?? 18;

      await queryRunner.query(
        `
        UPDATE "tokens"
        SET decimals = $1
        WHERE address = $2 AND network = $3
      `,
        [decimals, donation.token_address, donation.network],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove the decimals column if needed
    await queryRunner.query(`
      ALTER TABLE "tokens"
      DROP COLUMN IF EXISTS "decimals"
    `);
  }
}
