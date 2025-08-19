import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Creator } from './creator.entity';

@Entity('referrals')
export class Referral {
  @PrimaryGeneratedColumn()
  id!: number;

  // Many referrals can come from one creator
  @ManyToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referrer_id' })
  referrer!: Creator;

  // One referral corresponds to one referred creator
  @OneToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'referred_id' })
  referred!: Creator;

  @Column()
  credited!: boolean;

  @Column({ name: 'number_of_followers' })
  numberOfFollowers?: number;
}
