import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddForceDonationOverlayRefresh1753315853694
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`                                                                                                                                                                       
      ALTER TABLE "creator"                                                                                                                                                                         
      ADD COLUMN IF NOT EXISTS "force_donation_overlay_refresh" BOOLEAN NOT NULL DEFAULT FALSE;                                                                                                              
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`                                                                                                                                                                       
      ALTER TABLE "creator"                                                                                                                                                                         
      DROP COLUMN IF EXISTS "force_overlay_refresh";                                                                                                                                                
    `);
  }
}
