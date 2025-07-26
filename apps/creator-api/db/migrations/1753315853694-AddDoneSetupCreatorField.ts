import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDoneSetupCreatorField1753315853694
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE creator ADD COLUMN done_setup BOOLEAN DEFAULT FALSE;
      `);

    await queryRunner.query(`DROP VIEW IF EXISTS creator_profile_view;`);

    await queryRunner.query(`
        CREATE VIEW "creator_profile_view" AS
        SELECT
          c.id as id,
          c.address as address,
          c.primary_address as "primaryAddress",
          c.name as name,
          c.display_name as "displayName",
          c.email as email,
          c.profile_picture_url as "profilePictureUrl",
          c.donation_url as "donationUrl",
          c.obs_url as "obsUrl",
          c.joined_at as "joinedAt",
          c.done_setup as "doneSetup",
          dp.minimum_alert_amount as "minimumAlertAmount",
          dp.minimum_tts_amount as "minimumTTSAmount",
          dp.minimum_sfx_amount as "minimumSfxAmount",
          dp.voice_id as "voiceId",
          dp.alert_sound as "alertSound",
          dp.alert_enabled as "alertEnabled",
          dp.tts_enabled as "ttsEnabled",
          dp.sfx_enabled as "sfxEnabled",
          dp.custom_bad_words as "customBadWords",
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
          c.display_name,
          c.email,
          c.profile_picture_url,
          c.donation_url,
          c.obs_url,
          c.joined_at,
          c.done_setup,
          dp.minimum_alert_amount,
          dp.minimum_tts_amount,
          dp.minimum_sfx_amount,
          dp.voice_id,
          dp.alert_sound,
          dp.alert_enabled,
          dp.tts_enabled,
          dp.sfx_enabled,
          dp.custom_bad_words;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE creator DROP COLUMN done_setup;
      `);

    await queryRunner.query(`DROP VIEW IF EXISTS creator_profile_view;`);

    await queryRunner.query(`
        CREATE VIEW "creator_profile_view" AS
        SELECT
          c.id as id,
          c.address as address,
          c.primary_address as "primaryAddress",
          c.name as name,
          c.display_name as "displayName",
          c.email as email,
          c.profile_picture_url as "profilePictureUrl",
          c.donation_url as "donationUrl",
          c.obs_url as "obsUrl",
          c.joined_at as "joinedAt",
          dp.minimum_alert_amount as "minimumAlertAmount",
          dp.minimum_tts_amount as "minimumTTSAmount",
          dp.minimum_sfx_amount as "minimumSfxAmount",
          dp.voice_id as "voiceId",
          dp.alert_sound as "alertSound",
          dp.alert_enabled as "alertEnabled",
          dp.tts_enabled as "ttsEnabled",
          dp.sfx_enabled as "sfxEnabled",
          dp.custom_bad_words as "customBadWords",
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
          c.display_name,
          c.email,
          c.profile_picture_url,
          c.donation_url,
          c.obs_url,
          c.joined_at,
          dp.minimum_alert_amount,
          dp.minimum_tts_amount,
          dp.minimum_sfx_amount,
          dp.voice_id,
          dp.alert_sound,
          dp.alert_enabled,
          dp.tts_enabled,
          dp.sfx_enabled,
          dp.custom_bad_words;
      `);
  }
}
