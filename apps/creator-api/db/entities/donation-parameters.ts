import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Creator } from "./creator.entity";

@Entity('donation-parameters')
export class Token {
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

  @OneToOne(() => Creator, (creator) => creator.networks)
  creator!: Creator;
}
