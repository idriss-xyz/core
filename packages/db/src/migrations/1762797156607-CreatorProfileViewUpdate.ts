import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatorProfileViewUpdate1762797156607
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
    await queryRunner.query(`
        CREATE VIEW "creator_profile_view" AS
        SELECT
          c.id,
          c.address,
          c.primary_address  AS "primaryAddress",
          c.name,
          c.display_name     AS "displayName",
          c.email,
          c.profile_picture_url AS "profilePictureUrl",
          c.donation_url     AS "donationUrl",
          c.obs_url          AS "obsUrl",
          c.goal_url         AS "goalUrl",
          c.joined_at        AS "joinedAt",
          c.done_setup       AS "doneSetup",
          c.receive_emails   AS "receiveEmails",
          c.twitch_id        AS "twitchId",
          c.is_donor         AS "isDonor",
          c.display_top_donor AS "displayTopDonor",
          dp.token_enabled        AS "tokenEnabled",
          dp.collectible_enabled   AS "collectibleEnabled",
          dp.minimum_alert_amount  AS "minimumAlertAmount",
          dp.minimum_tts_amount    AS "minimumTTSAmount",
          dp.minimum_sfx_amount    AS "minimumSfxAmount",
          dp.voice_id              AS "voiceId",
          dp.alert_sound           AS "alertSound",
          dp.alert_enabled         AS "alertEnabled",
          dp.tts_enabled           AS "ttsEnabled",
          dp.sfx_enabled           AS "sfxEnabled",
          dp.custom_bad_words      AS "customBadWords",
          COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"),NULL), ARRAY[]::text[]) AS tokens,
          COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"),NULL), ARRAY[]::text[]) AS networks
        FROM creator c
        LEFT JOIN donation_parameters dp ON dp.creator_id = c.id
        LEFT JOIN creator_tokens        ct ON ct.creator_id = c.id
        LEFT JOIN creator_networks      cn ON cn.creator_id = c.id
        GROUP BY
          c.id, c.address, c.primary_address, c.name, c.display_name, c.email,
          c.profile_picture_url, c.donation_url, c.obs_url, c.goal_url,
          c.joined_at, c.done_setup, c.receive_emails, c.is_donor, c.display_top_donor,
          c.twitch_id, dp.token_enabled, dp.collectible_enabled,
          dp.minimum_alert_amount, dp.minimum_tts_amount, dp.minimum_sfx_amount,
          dp.voice_id, dp.alert_sound, dp.alert_enabled, dp.tts_enabled,
          dp.sfx_enabled, dp.custom_bad_words;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
    await queryRunner.query(`
        CREATE VIEW "creator_profile_view" AS
        SELECT
          c.id,
          c.address,
          c.primary_address  AS "primaryAddress",
          c.name,
          c.display_name     AS "displayName",
          c.email,
          c.profile_picture_url AS "profilePictureUrl",
          c.donation_url     AS "donationUrl",
          c.obs_url          AS "obsUrl",
          c.goal_url         AS "goalUrl",
          c.joined_at        AS "joinedAt",
          c.done_setup       AS "doneSetup",
          c.receive_emails   AS "receiveEmails",
          c.is_donor         AS "isDonor",
          c.display_top_donor AS "displayTopDonor",
          dp.token_enabled        AS "tokenEnabled",
          dp.collectible_enabled   AS "collectibleEnabled",
          dp.minimum_alert_amount  AS "minimumAlertAmount",
          dp.minimum_tts_amount    AS "minimumTTSAmount",
          dp.minimum_sfx_amount    AS "minimumSfxAmount",
          dp.voice_id              AS "voiceId",
          dp.alert_sound           AS "alertSound",
          dp.alert_enabled         AS "alertEnabled",
          dp.tts_enabled           AS "ttsEnabled",
          dp.sfx_enabled           AS "sfxEnabled",
          dp.custom_bad_words      AS "customBadWords",
          COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"),NULL), ARRAY[]::text[]) AS tokens,
          COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"),NULL), ARRAY[]::text[]) AS networks
        FROM creator c
        LEFT JOIN donation_parameters dp ON dp.creator_id = c.id
        LEFT JOIN creator_tokens        ct ON ct.creator_id = c.id
        LEFT JOIN creator_networks      cn ON cn.creator_id = c.id
        GROUP BY
          c.id, c.address, c.primary_address, c.name, c.display_name, c.email,
          c.profile_picture_url, c.donation_url, c.obs_url, c.goal_url,
          c.joined_at, c.done_setup, c.receive_emails, c.is_donor, c.display_top_donor,
          dp.token_enabled, dp.collectible_enabled,
          dp.minimum_alert_amount, dp.minimum_tts_amount, dp.minimum_sfx_amount,
          dp.voice_id, dp.alert_sound, dp.alert_enabled, dp.tts_enabled,
          dp.sfx_enabled, dp.custom_bad_words;
      `);
  }
}
