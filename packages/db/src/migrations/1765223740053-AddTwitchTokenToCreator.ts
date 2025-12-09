import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwitchTokenToCreator1765223740053
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creators" ADD COLUMN "twitch_oauth_token" VARCHAR(255) NULL,
        ADD COLUMN "twitch_refresh_token" VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creators" DROP COLUMN "twitch_oauth_token",
        DROP COLUMN "twitch_refresh_token"`,
    );
  }
}
