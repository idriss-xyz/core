import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDisplayTopDonor1762624664000 implements MigrationInterface {
  public async up(q: QueryRunner): Promise<void> {
    await q.query(
      `ALTER TABLE "creator" ADD COLUMN "display_top_donor" boolean NOT NULL DEFAULT true`,
    );

    await q.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
    await q.query(`
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

    await q.query(`DROP VIEW IF EXISTS "donation_goal_view";`);
    await q.query(`
      CREATE VIEW "donation_goal_view" AS
      SELECT
        g.id,
        g.name,
        g.target_amount AS "targetAmount",
        g.start_date    AS "startDate",
        g.end_date      AS "endDate",
        g.active,
        g.deleted,
        c.name          AS "creatorName",
        COALESCE(SUM(d.trade_value),0) AS progress,
        c.display_top_donor           AS "displayTopDonor",
        (
          SELECT COALESCE(c2.name, cc.name, 'anon')
          FROM creator_donations du
          LEFT JOIN creator         c2 ON LOWER(c2.address) = LOWER(du.from_address)
          LEFT JOIN creator_address ca ON LOWER(ca.address) = LOWER(du.from_address)
          LEFT JOIN creator         cc ON cc.id = ca.creator_id
          WHERE du.donation_goal_id = g.id
            AND du.timestamp >= g.start_date
            AND du.timestamp <= g.end_date
          GROUP BY c2.name, cc.name
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorName",
        (
          SELECT SUM(du.trade_value)
          FROM creator_donations du
          WHERE du.donation_goal_id = g.id
            AND du.timestamp >= g.start_date
            AND du.timestamp <= g.end_date
          GROUP BY du.from_address
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorAmount"
      FROM donation_goal g
      LEFT JOIN creator            c ON c.id = g.creator_id
      LEFT JOIN creator_donations  d ON d.donation_goal_id = g.id
                                       AND d.timestamp >= g.start_date
                                       AND d.timestamp <= g.end_date
      GROUP BY
        g.id, g.name, g.target_amount, g.start_date, g.end_date,
        g.active, g.deleted, c.name, c.display_top_donor;
    `);
  }

  public async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
    await q.query(`DROP VIEW IF EXISTS "donation_goal_view";`);
    /* views without the new column */
    await q.query(`
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
        c.joined_at, c.done_setup, c.receive_emails, c.is_donor,
        dp.minimum_alert_amount, dp.minimum_tts_amount, dp.minimum_sfx_amount,
        dp.voice_id, dp.alert_sound, dp.alert_enabled, dp.tts_enabled,
        dp.sfx_enabled, dp.custom_bad_words;
    `);

    await q.query(`
      CREATE VIEW "donation_goal_view" AS
      SELECT
        g.id,
        g.name,
        g.target_amount AS "targetAmount",
        g.start_date    AS "startDate",
        g.end_date      AS "endDate",
        g.active,
        g.deleted,
        c.name          AS "creatorName",
        COALESCE(SUM(d.trade_value),0) AS progress,
        (
          SELECT COALESCE(c2.name, cc.name, 'anon')
          FROM creator_donations du
          LEFT JOIN creator         c2 ON LOWER(c2.address) = LOWER(du.from_address)
          LEFT JOIN creator_address ca ON LOWER(ca.address) = LOWER(du.from_address)
          LEFT JOIN creator         cc ON cc.id = ca.creator_id
          WHERE du.donation_goal_id = g.id
            AND du.timestamp >= g.start_date
            AND du.timestamp <= g.end_date
          GROUP BY c2.name, cc.name
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorName",
        (
          SELECT SUM(du.trade_value)
          FROM creator_donations du
          WHERE du.donation_goal_id = g.id
          GROUP BY du.from_address
          ORDER BY SUM(du.trade_value) DESC
          LIMIT 1
        ) AS "topDonorAmount"
      FROM donation_goal g
      LEFT JOIN creator            c ON c.id = g.creator_id
      LEFT JOIN creator_donations  d ON d.donation_goal_id = g.id
                                       AND d.timestamp >= g.start_date
                                       AND d.timestamp <= g.end_date
      GROUP BY
        g.id, g.name, g.target_amount, g.start_date, g.end_date,
        g.active, g.deleted, c.name;
    `);

    /* finally remove the column */
    await q.query(`ALTER TABLE "creator" DROP COLUMN "display_top_donor";`);
  }
}
