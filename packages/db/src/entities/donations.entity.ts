import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hex } from 'viem';

import { User } from './user.entity';
import { DonationGoal } from './donation-goal.entity';

@Entity('creator_donations')
export abstract class Donation {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id!: number;

  @Column({ type: 'text', name: 'transaction_hash', unique: true })
  transactionHash!: Hex;

  @Column({ type: 'text', name: 'from_address' })
  fromAddress!: Hex;

  @Column({ type: 'text', name: 'to_address' })
  toAddress!: Hex;

  @Column({
    type: 'bigint',
    transformer: {
      from: Number,
      to: (value: number) => {
        return value;
      },
    },
  })
  timestamp!: number;

  @Column({ type: 'text', nullable: true })
  comment?: string;

  @Column({
    type: 'decimal',
    name: 'trade_value',
    precision: 36,
    scale: 18,
    transformer: {
      from: Number,
      to: (value: number) => {
        return value;
      },
    },
  })
  tradeValue!: number;

  @ManyToOne(() => {
    return User;
  })
  @JoinColumn({ name: 'from_address' })
  fromUser!: User;

  @ManyToOne(() => {
    return User;
  })
  @JoinColumn({ name: 'to_address' })
  toUser!: User;

  @Column({ type: 'json' })
  data!: object;

  @ManyToOne(
    () => {
      return DonationGoal;
    },
    (donationGoal) => {
      return donationGoal.donations;
    },
    {
      nullable: true,
    },
  )
  @JoinColumn({ name: 'donation_goal_id' })
  donationGoal?: DonationGoal;
}
