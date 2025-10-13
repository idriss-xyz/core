import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Creator } from './creator.entity';

@Entity('donation_parameters')
export class DonationParameters {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', name: 'minimum_alert_amount' })
  minimumAlertAmount!: number;

  @Column({ type: 'integer', name: 'minimum_tts_amount' })
  minimumTTSAmount!: number;

  @Column({ type: 'integer', name: 'minimum_sfx_amount' })
  minimumSfxAmount!: number;

  @Column({ name: 'voice_id', nullable: true })
  voiceId!: string;

  @Column({ name: 'alert_sound', nullable: true })
  alertSound!: string;

  @Column({ name: 'alert_enabled', default: false })
  alertEnabled!: boolean;

  @Column({ name: 'tts_enabled', default: false })
  ttsEnabled!: boolean;

  @Column({ name: 'sfx_enabled', default: false })
  sfxEnabled!: boolean;

  @Column({
    name: 'custom_bad_words',
    type: 'text',
    array: true,
    default: '{}',
  })
  customBadWords!: string[];

  @Column({ name: 'token_enabled', default: true })
  tokenEnabled!: boolean;

  @Column({ name: 'collectible_enabled', default: true })
  collectibleEnabled!: boolean;

  @OneToOne(
    () => {
      return Creator;
    },
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
