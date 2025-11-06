import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCreatorFollowedChannel1762428522000
  implements MigrationInterface
{
  public async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE "creator_followed_channel" (
        "id"                      SERIAL PRIMARY KEY,
        "creator_id"              integer NOT NULL
          REFERENCES "creator"("id") ON DELETE CASCADE,
        "channel_name"            text    NOT NULL,
        "channel_display_name"    text,
        "channel_profile_image_url" text,
        CONSTRAINT "uq_creator_channel"
          UNIQUE ("creator_id", "channel_name")
      );
      CREATE INDEX "idx_creator_followed_channel_creator_id"
        ON "creator_followed_channel" ("creator_id");
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE "creator_followed_channel";`);
  }
}
