import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBotTokenToCreator1764789778886 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creators" ADD COLUMN "twitch_bot_token" VARCHAR(255) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "creators" DROP COLUMN "twitch_bot_token"`,
    );
  }
}
