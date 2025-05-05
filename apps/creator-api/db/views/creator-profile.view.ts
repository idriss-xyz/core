import { ViewEntity, ViewColumn, DataSource } from 'typeorm';
import { Token } from '../entities';
import { Creator } from '../entities/creator.entity';
import { DonationParameters } from '../entities/donation-parameters.entity';

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
      .from(Creator, 'c')
      .leftJoin(DonationParameters, 'dp', 'dp.creator_id = c.id'),
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
}
