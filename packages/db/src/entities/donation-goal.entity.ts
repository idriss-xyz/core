import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Creator } from './creator.entity';
import { Donation } from './donations.entity';

@Entity('donation_goal')
export class DonationGoal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', name: 'name', unique: true })
  name!: string;

  @Column({ type: 'integer', name: 'target_amount' })
  targetAmount!: number;

  @Column({ type: 'bigint', name: 'start_date' })
  startDate!: number;

  @Column({ type: 'bigint', name: 'end_date' })
  endDate!: number;

  @Column({ type: 'boolean', name: 'active', default: false })
  active!: boolean;

  @Column({ type: 'boolean', name: 'deleted', default: false })
  deleted!: boolean;

  @ManyToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;

  @OneToMany(() => Donation, (donation) => donation.donationGoal)
  donations!: Donation[];
}
