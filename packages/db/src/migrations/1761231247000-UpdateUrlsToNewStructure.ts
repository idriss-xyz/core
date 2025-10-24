import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUrlsToNewStructure1761231247000
  implements MigrationInterface
{
  name = 'UpdateUrlsToNewStructure1761231247000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE creator
      SET "obs_url" = REPLACE("obs_url", '/creators/donation-overlay', '/alert-overlay')
      WHERE "obs_url" LIKE '%/creators/donation-overlay%';
    `);

    await queryRunner.query(`
      UPDATE creator
      SET "donation_url" = REPLACE("donation_url", '/creators', '')
      WHERE "donation_url" LIKE '%/creators%';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE creator
      SET "obs_url" = REPLACE("obs_url", '/alert-overlay', '/creators/donation-overlay')
      WHERE "obs_url" LIKE '%/alert-overlay%';
    `);

    await queryRunner.query(`
      UPDATE creator
      SET "donation_url" = '/creators' || "donation_url"
      WHERE "donation_url" NOT LIKE '/creators%' AND "donation_url" NOT LIKE '%/creators%';
    `);
  }
}
