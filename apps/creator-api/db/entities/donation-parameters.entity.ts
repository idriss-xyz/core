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

  @Column({ type: 'text', name: 'voice_id' })
  voiceId!: string;

  @Column({ type: 'boolean', name: 'voice_muted' })
  voiceMuted!: boolean;

  @OneToOne(() => Creator)
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
