import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatorProfileEntities1747843796640
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create creator table
    await queryRunner.query(`
            CREATE TABLE "creator" (
                "id" SERIAL NOT NULL,
                "address" text NOT NULL,
                "primary_address" text NOT NULL,
                "name" text NOT NULL,
                "profile_picture_url" text,
                "donation_url" text,
                "obs_url" text,
                CONSTRAINT "PK_creator" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_creator_address" UNIQUE ("address"),
                CONSTRAINT "UQ_creator_primary_address" UNIQUE ("primary_address"),
                CONSTRAINT "UQ_creator_name" UNIQUE ("name")
            )
        `);

    // Create creator_networks table
    await queryRunner.query(`
            CREATE TABLE "creator_networks" (
                "id" SERIAL NOT NULL,
                "chainName" text NOT NULL,
                "creator_id" integer,
                CONSTRAINT "PK_creator_networks" PRIMARY KEY ("id"),
                CONSTRAINT "FK_creator_networks_creator" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Create creator_tokens table
    await queryRunner.query(`
            CREATE TABLE "creator_tokens" (
                "id" SERIAL NOT NULL,
                "tokenSymbol" text NOT NULL,
                "creator_id" integer,
                CONSTRAINT "PK_creator_tokens" PRIMARY KEY ("id"),
                CONSTRAINT "FK_creator_tokens_creator" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Create donation_parameters table
    await queryRunner.query(`
            CREATE TABLE "donation_parameters" (
                "id" SERIAL NOT NULL,
                "minimum_alert_amount" text NOT NULL,
                "minimum_tts_amount" text NOT NULL,
                "minimum_sfx_amount" text NOT NULL,
                "voice_id" text,
                "voice_muted" boolean DEFAULT false,
                "creator_id" integer,
                CONSTRAINT "PK_donation_parameters" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_donation_parameters_creator_id" UNIQUE ("creator_id"),
                CONSTRAINT "FK_donation_parameters_creator" FOREIGN KEY ("creator_id") REFERENCES "creator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
            )
        `);

    // Create creator_profile view
    await queryRunner.query(`
            CREATE VIEW "creator_profile_view" AS
            SELECT
                c.id as id,
                c.address as address,
                c.primary_address as "primaryAddress",
                c.name as name,
                c.profile_picture_url as "profilePictureUrl",
                c.donation_url as "donationUrl",
                c.obs_url as "obsUrl",
                dp.minimum_alert_amount as "minimumAlertAmount",
                dp.minimum_tts_amount as "minimumTTSAmount",
                dp.minimum_sfx_amount as "minimumSfxAmount",
                dp.voice_id as "voiceId",
                dp.voice_muted as "voiceMuted",
                COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"), NULL), ARRAY[]::text[]) as tokens,
                COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"), NULL), ARRAY[]::text[]) as networks
            FROM creator c
            LEFT JOIN donation_parameters dp ON dp.creator_id = c.id
            LEFT JOIN creator_tokens ct ON ct.creator_id = c.id
            LEFT JOIN creator_networks cn ON cn.creator_id = c.id
            GROUP BY
                c.id,
                c.address,
                c.primary_address,
                c.name,
                c.profile_picture_url,
                c.donation_url,
                c.obs_url,
                dp.minimum_alert_amount,
                dp.minimum_tts_amount,
                dp.minimum_sfx_amount,
                dp.voice_id,
                dp.voice_muted
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop view first
    await queryRunner.query(`DROP VIEW IF EXISTS "creator_profile_view"`);

    // Drop tables in reverse order to avoid foreign key constraints
    await queryRunner.query(`DROP TABLE IF EXISTS "donation_parameters"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "creator_tokens"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "creator_networks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "creator"`);
  }
}
