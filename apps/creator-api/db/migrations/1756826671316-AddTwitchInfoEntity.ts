import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class AddTwitchInfo1756826671316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create twitch_info table
    await queryRunner.createTable(
      new Table({
        name: 'twitch_info',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'twitch_id',
            type: 'text',
            isUnique: true,
          },
          {
            name: 'username',
            type: 'text',
          },
          {
            name: 'email',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'socials',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'follower_count',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp with time zone',
            default: 'now()',
          },
        ],
      }),
    );

    // Add twitch_id column to creator table
    await queryRunner.addColumn(
      'creator',
      new TableColumn({
        name: 'twitch_id',
        type: 'text',
        isNullable: true,
        isUnique: true,
      }),
    );

    // Create foreign key relationship
    await queryRunner.createForeignKey(
      'creator',
      new TableForeignKey({
        columnNames: ['twitch_id'],
        referencedTableName: 'twitch_info',
        referencedColumnNames: ['twitch_id'],
        onDelete: 'SET NULL',
      }),
    );

    // Recreate the creator profile view to include twitch_id
    await queryRunner.query('DROP VIEW IF EXISTS creator_profile_view');
    await queryRunner.query(`
      CREATE VIEW creator_profile_view AS
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
        c.done_setup AS "doneSetup",
        c.receive_emails AS "receiveEmails",
        c.twitch_id AS "twitchId",
        dp.minimum_alert_amount AS "minimumAlertAmount",
        dp.minimum_tts_amount AS "minimumTTSAmount",
        dp.minimum_sfx_amount AS "minimumSfxAmount",
        dp.voice_id AS "voiceId",
        dp.alert_sound AS "alertSound",
        dp.alert_enabled AS "alertEnabled",
        dp.tts_enabled AS "ttsEnabled",
        dp.sfx_enabled AS "sfxEnabled",
        dp.custom_bad_words AS "customBadWords",
        COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"), NULL), ARRAY[]::text[]) AS tokens,
        COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"), NULL), ARRAY[]::text[]) AS networks
      FROM creator c
      LEFT JOIN donation_parameters dp ON dp.creator_id = c.id
      LEFT JOIN creator_token ct ON ct.creator_id = c.id
      LEFT JOIN creator_network cn ON cn.creator_id = c.id
      GROUP BY
        c.id, c.address, c.primary_address, c.name, c.display_name, c.email,
        c.profile_picture_url, c.donation_url, c.obs_url, c.joined_at,
        c.done_setup, c.receive_emails, c.twitch_id,
        dp.minimum_alert_amount, dp.minimum_tts_amount, dp.minimum_sfx_amount,
        dp.voice_id, dp.alert_sound, dp.alert_enabled, dp.tts_enabled,
        dp.sfx_enabled, dp.custom_bad_words
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the view
    await queryRunner.query('DROP VIEW IF EXISTS creator_profile_view');

    // Drop foreign key
    const table = await queryRunner.getTable('creator');
    const foreignKey = table?.foreignKeys.find(fk => fk.columnNames.indexOf('twitch_id') !== -1);
    if (foreignKey) {
      await queryRunner.dropForeignKey('creator', foreignKey);
    }

    // Drop twitch_id column from creator
    await queryRunner.dropColumn('creator', 'twitch_id');

    // Drop twitch_info table
    await queryRunner.dropTable('twitch_info');

    // Recreate the original view without twitch_id
    await queryRunner.query(`
      CREATE VIEW creator_profile_view AS
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
        c.done_setup AS "doneSetup",
        c.receive_emails AS "receiveEmails",
        dp.minimum_alert_amount AS "minimumAlertAmount",
        dp.minimum_tts_amount AS "minimumTTSAmount",
        dp.minimum_sfx_amount AS "minimumSfxAmount",
        dp.voice_id AS "voiceId",
        dp.alert_sound AS "alertSound",
        dp.alert_enabled AS "alertEnabled",
        dp.tts_enabled AS "ttsEnabled",
        dp.sfx_enabled AS "sfxEnabled",
        dp.custom_bad_words AS "customBadWords",
        COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"), NULL), ARRAY[]::text[]) AS tokens,
        COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"), NULL), ARRAY[]::text[]) AS networks
      FROM creator c
      LEFT JOIN donation_parameters dp ON dp.creator_id = c.id
      LEFT JOIN creator_token ct ON ct.creator_id = c.id
      LEFT JOIN creator_network cn ON cn.creator_id = c.id
      GROUP BY
        c.id, c.address, c.primary_address, c.name, c.display_name, c.email,
        c.profile_picture_url, c.donation_url, c.obs_url, c.joined_at,
        c.done_setup, c.receive_emails,
        dp.minimum_alert_amount, dp.minimum_tts_amount, dp.minimum_sfx_amount,
        dp.voice_id, dp.alert_sound, dp.alert_enabled, dp.tts_enabled,
        dp.sfx_enabled, dp.custom_bad_words
    `);
  }
}
