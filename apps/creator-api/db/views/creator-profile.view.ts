import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { Creator } from '../entities/creator.entity';
import { CreatorNetwork, CreatorToken, DonationParameters } from '../entities';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('c.id', 'id')
      .addSelect('c.address', 'address')
      .addSelect('c.primary_address', 'primaryAddress')
      .addSelect('c.name', 'name')
      .addSelect('c.profile_picture_url', 'profilePictureUrl')
      .addSelect('c.donation_url', 'donationUrl')
      .addSelect('c.obs_url', 'obsUrl')
      .addSelect('dp.minimum_alert_amount', 'minimumAlertAmount')
      .addSelect('dp.minimum_tts_amount', 'minimumTTSAmount')
      .addSelect('dp.minimum_sfx_amount', 'minimumSfxAmount')
      .addSelect('dp.voice_id', 'voiceId')
      .addSelect('dp.voice_muted', 'voiceMuted')
      .addSelect(
        'COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT ct.tokenAddress), NULL), ARRAY[]::text[])',
        'tokens',
      )
      .addSelect(
        'COALESCE(ARRAY_REMOVE(ARRAY_AGG(DISTINCT cn.chainId), NULL), ARRAY[]::int[])',
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
      .addGroupBy('c.profile_picture_url')
      .addGroupBy('c.donation_url')
      .addGroupBy('c.obs_url')
      .addGroupBy('dp.minimum_alert_amount')
      .addGroupBy('dp.minimum_tts_amount')
      .addGroupBy('dp.minimum_sfx_amount')
      .addGroupBy('dp.voice_id')
      .addGroupBy('dp.voice_muted'),
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
  profilePictureUrl!: string | null;

  @ViewColumn()
  donationUrl!: string | null;

  @ViewColumn()
  obsUrl!: string | null;

  @ViewColumn()
  minimumAlertAmount!: number;

  @ViewColumn()
  minimumTTSAmount!: number;

  @ViewColumn()
  minimumSfxAmount!: number;

  @ViewColumn()
  voiceId!: string;

  @ViewColumn()
  voiceMuted!: boolean;

  @ViewColumn()
  tokens!: string[];

  @ViewColumn()
  networks!: number[];
}
