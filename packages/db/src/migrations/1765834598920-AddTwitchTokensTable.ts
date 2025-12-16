import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTwitchTokensTable1765834598920 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "twitch_tokens" (
        "twitch_id" character varying NOT NULL,
        "access_token" text NOT NULL,
        "refresh_token" text NOT NULL,
        CONSTRAINT "PK_twitchTokens_key" PRIMARY KEY ("twitch_id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "twitch_tokens"`);
  }
}
