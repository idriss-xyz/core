import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Creator } from './creator.entity';
import { Donation } from './donations.entity';

@Entity('donation_goal')
export abstract class DonationGoal {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', name: 'name', unique: true })
  name!: string;

  @Column({ type: 'integer', name: 'target_amount' })
  targetAmount!: number;

  @Column({ type: 'timestamp', name: 'start_date' })
  startDate!: Date;

  @Column({ type: 'timestamp', name: 'end_date' })
  endDate!: Date;

  @Column({ type: 'boolean', name: 'active' })
  active!: boolean;

  @ManyToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;

  @ManyToMany(() => Donation)
  @JoinTable()
  donations!: Donation[];
}
