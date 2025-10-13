import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('donation_effect')
export class DonationEffect {
  @PrimaryColumn({ type: 'varchar', length: 66 })
  txHash!: string;

  @Column({ type: 'text' })
  sfxMessage!: string;

  @Column({
    type: 'timestamp',
    default: () => {
      return 'CURRENT_TIMESTAMP';
    },
  })
  createdAt!: Date;
}
