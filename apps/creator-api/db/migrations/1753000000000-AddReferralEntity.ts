import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddReferralEntity1753000000000 implements MigrationInterface {
  name = 'AddReferralEntity1753000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "referrals" (
        "id" SERIAL PRIMARY KEY,
        "referrer_id" INTEGER NOT NULL,
        "referred_id" INTEGER NOT NULL UNIQUE,
        "credited" BOOLEAN NOT NULL,
        "number_of_followers" INTEGER NOT NULL,
        CONSTRAINT "FK_referrals_referrer" FOREIGN KEY ("referrer_id") REFERENCES "creator"("id"),
        CONSTRAINT "FK_referrals_referred" FOREIGN KEY ("referred_id") REFERENCES "creator"("id")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "referral"`);
  }
}
