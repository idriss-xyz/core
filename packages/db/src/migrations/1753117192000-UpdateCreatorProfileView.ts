import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateCreatorProfileView1753117192000
  implements MigrationInterface
{
  private readonly viewSql = `
    CREATE VIEW "creator_profile_view" AS
    SELECT
      c.id,
      c.address,
      c.primary_address AS "primaryAddress",
      c.name,
      c.display_name AS "displayName",
      c.email,
      c.profile_picture_url AS "profilePictureUrl",
      c.donation_url AS "donationUrl",
      c.obs_url AS "obsUrl",
      c.joined_at AS "joinedAt",
      dp.minimum_alert_amount AS "minimumAlertAmount",
      dp.minimum_tts_amount AS "minimumTTSAmount",
      dp.minimum_sfx_amount AS "minimumSfxAmount",
      dp.voice_id AS "voiceId",
      dp.alert_enabled AS "alertEnabled",
      dp.tts_enabled AS "ttsEnabled",
      dp.sfx_enabled AS "sfxEnabled",
      dp.custom_bad_words AS "customBadWords",
      COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"), NULL), ARRAY[]::text[]) AS "tokens",
      COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"), NULL), ARRAY[]::text[]) AS "networks"
    FROM
      creator c
    LEFT JOIN
      donation_parameters dp ON dp.creator_id = c.id
    LEFT JOIN
      creator_tokens ct ON ct.creator_id = c.id
    LEFT JOIN
      creator_networks cn ON cn.creator_id = c.id
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
      dp.alert_enabled,
      dp.tts_enabled,
      dp.sfx_enabled,
      dp.custom_bad_words;
  `;

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
    await queryRunner.query(this.viewSql);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert to a state before this view existed or recreate the old one if needed.
    // For simplicity, we'll just drop it.
    await queryRunner.query(`DROP VIEW IF EXISTS "creator_profile_view";`);
  }
}
