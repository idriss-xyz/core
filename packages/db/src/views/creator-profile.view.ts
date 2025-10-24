import { ViewEntity, ViewColumn, DataSource } from 'typeorm';

import { Creator } from '../entities/creator.entity';
import { CreatorNetwork, CreatorToken, DonationParameters } from '../entities';

@ViewEntity({
  expression: (dataSource: DataSource) => {
    return dataSource
      .createQueryBuilder()
      .select('c.id', 'id')
      .addSelect('c.address', 'address')
      .addSelect('c.primary_address', 'primaryAddress')
      .addSelect('c.name', 'name')
      .addSelect('c.display_name', 'displayName')
      .addSelect('c.email', 'email')
      .addSelect('c.profile_picture_url', 'profilePictureUrl')
      .addSelect('c.donation_url', 'donationUrl')
      .addSelect('c.obs_url', 'obsUrl')
      .addSelect('c.joined_at', 'joinedAt')
      .addSelect('c.done_setup', 'doneSetup')
      .addSelect('c.receive_emails', 'receiveEmails')
      .addSelect('c.is_donor', 'isDonor')
      .addSelect('dp.token_enabled', 'tokenEnabled')
      .addSelect('dp.collectible_enabled', 'collectibleEnabled')
      .addSelect('dp.minimum_alert_amount', 'minimumAlertAmount')
      .addSelect('dp.minimum_tts_amount', 'minimumTTSAmount')
      .addSelect('dp.minimum_sfx_amount', 'minimumSfxAmount')
      .addSelect('dp.voice_id', 'voiceId')
      .addSelect('dp.alert_sound', 'alertSound')
      .addSelect('dp.alert_enabled', 'alertEnabled')
      .addSelect('dp.tts_enabled', 'ttsEnabled')
      .addSelect('dp.sfx_enabled', 'sfxEnabled')
      .addSelect('dp.custom_bad_words', 'customBadWords')
      .addSelect(
        'COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct."tokenSymbol"), NULL), ARRAY[]::text[])',
        'tokens',
      )
      .addSelect(
        'COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn."chainName"), NULL), ARRAY[]::text[])',
        'networks',
      )
      .from(Creator, 'c')
      .leftJoin(DonationParameters, 'dp', 'dp.creator_id = c.id')
      .leftJoin(CreatorToken, 'ct', 'ct.creator_id = c.id')
      .leftJoin(CreatorNetwork, 'cn', 'cn.creator_id = c.id')
      .groupBy('c.id')
      .addGroupBy('c.address')
      .addGroupBy('c.primary_address')
      .addGroupBy('c.name')
      .addGroupBy('c.display_name')
      .addGroupBy('c.email')
      .addGroupBy('c.profile_picture_url')
      .addGroupBy('c.donation_url')
      .addGroupBy('c.obs_url')
      .addGroupBy('c.joined_at')
      .addGroupBy('c.done_setup')
      .addGroupBy('c.receiveEmails')
      .addGroupBy('c.is_donor')
      .addGroupBy('dp.minimum_alert_amount')
      .addGroupBy('dp.minimum_tts_amount')
      .addGroupBy('dp.minimum_sfx_amount')
      .addGroupBy('dp.voice_id')
      .addGroupBy('dp.alert_sound')
      .addGroupBy('dp.alert_enabled')
      .addGroupBy('dp.tts_enabled')
      .addGroupBy('dp.sfx_enabled')
      .addGroupBy('dp.custom_bad_words');
  },
})
export class CreatorProfileView {
  @ViewColumn()
  id!: number;

  @ViewColumn()
  address!: string;

  @ViewColumn()
  primaryAddress!: string;

  @ViewColumn()
  name!: string;

  @ViewColumn()
  displayName!: string;

  @ViewColumn()
  email!: string | null;

  @ViewColumn()
  profilePictureUrl!: string | null;

  @ViewColumn()
  donationUrl!: string | null;

  @ViewColumn()
  obsUrl!: string | null;

  @ViewColumn()
  joinedAt!: Date;

  @ViewColumn()
  doneSetup!: boolean;

  @ViewColumn()
  receiveEmails!: boolean;

  @ViewColumn()
  isDonor!: boolean;

  @ViewColumn()
  tokenEnabled!: boolean;

  @ViewColumn()
  collectibleEnabled!: boolean;

  @ViewColumn()
  minimumAlertAmount!: number;

  @ViewColumn()
  minimumTTSAmount!: number;

  @ViewColumn()
  minimumSfxAmount!: number;

  @ViewColumn()
  voiceId!: string;

  @ViewColumn()
  alertSound!: string;

  @ViewColumn()
  alertEnabled!: boolean;

  @ViewColumn()
  ttsEnabled!: boolean;

  @ViewColumn()
  sfxEnabled!: boolean;

  @ViewColumn()
  customBadWords!: string[];

  @ViewColumn()
  tokens!: string[];

  @ViewColumn()
  networks!: string[];
}
