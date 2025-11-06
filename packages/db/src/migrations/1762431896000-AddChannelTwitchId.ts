import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddChannelTwitchId1762431896000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      ALTER TABLE "creator_followed_channel"
        ADD COLUMN "channel_twitch_id" text NOT NULL;

      ALTER TABLE "creator_followed_channel"
        DROP CONSTRAINT IF EXISTS "uq_creator_channel";

      ALTER TABLE "creator_followed_channel"
        ADD CONSTRAINT "uq_creator_channel_twitch_id"
        UNIQUE ("creator_id","channel_twitch_id");
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`
      ALTER TABLE "creator_followed_channel"
        DROP CONSTRAINT IF EXISTS "uq_creator_channel_twitch_id";

      ALTER TABLE "creator_followed_channel"
        ADD CONSTRAINT "uq_creator_channel"
        UNIQUE ("creator_id","channel_name");

      ALTER TABLE "creator_followed_channel"
        DROP COLUMN "channel_twitch_id";
    `);
  }
}
