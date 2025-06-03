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

  @Column({
    name: 'minimum_alert_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  minimumAlertAmount!: number;

  @Column({
    name: 'minimum_tts_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  minimumTTSAmount!: number;

  @Column({
    name: 'minimum_sfx_amount',
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  minimumSfxAmount!: number;

  @Column({ name: 'voice_id', nullable: true })
  voiceId!: string;

  @Column({ name: 'alert_muted', default: false })
  alertMuted!: boolean;

  @Column({ name: 'tts_muted', default: false })
  ttsMuted!: boolean;

  @Column({ name: 'sfx_muted', default: false })
  sfxMuted!: boolean;

  @Column({
    name: 'custom_bad_words',
    type: 'text',
    array: true,
    default: '{}',
  })
  customBadWords!: string[];

  @OneToOne(() => Creator)
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
