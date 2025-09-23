import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveWwwFromUrls1758590345135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Remove www. from obs_url column
    await queryRunner.query(`
      UPDATE creator
      SET obs_url = CASE
        WHEN obs_url LIKE 'https://www.%' THEN REPLACE(obs_url, 'https://www.', 'https://')
        WHEN obs_url LIKE 'http://www.%' THEN REPLACE(obs_url, 'http://www.', 'http://')
        ELSE obs_url
      END
      WHERE obs_url IS NOT NULL
    `);

    // Remove www. from donation_url column
    await queryRunner.query(`
      UPDATE creator
      SET donation_url = CASE
        WHEN donation_url LIKE 'https://www.%' THEN REPLACE(donation_url, 'https://www.', 'https://')
        WHEN donation_url LIKE 'http://www.%' THEN REPLACE(donation_url, 'http://www.', 'http://')
        ELSE donation_url
      END
      WHERE donation_url IS NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no-op (non reversible change)
  }
}
