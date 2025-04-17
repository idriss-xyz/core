import { MigrationInterface, QueryRunner } from 'typeorm';

class WebhookChainType1743608322000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add the column as nullable first
    await queryRunner.query(
      `ALTER TABLE webhooks ADD COLUMN "chainType" text NULL`,
    );

    // Update all existing records
    await queryRunner.query(`UPDATE webhooks SET "chainType" = 'EVM'`);

    // Make the column non-nullable after setting values
    await queryRunner.query(
      `ALTER TABLE webhooks ALTER COLUMN "chainType" SET NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE webhooks DROP COLUMN "chainType"`);
  }
}
