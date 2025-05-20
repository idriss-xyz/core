import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDonationEffects1747686797772 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "donation_effect" (
                "id" SERIAL PRIMARY KEY,
                "txHash" character varying NOT NULL,
                "sfxMessage" character varying(30) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

    await queryRunner.query(`
            CREATE INDEX "IDX_donation_effect_tx_hash" ON "donation_effect" ("txHash")
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_donation_effect_tx_hash"`);
    await queryRunner.query(`DROP TABLE "donation_effect"`);
  }
}
