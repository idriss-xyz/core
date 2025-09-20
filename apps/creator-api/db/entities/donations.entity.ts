import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hex } from 'viem';
import { User } from './user.entity';
import { ZapperNode } from '../../types';

@Entity('creator_donations')
export abstract class Donation {
  @PrimaryGeneratedColumn()
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
      from: (value: string) => Number(value),
      to: (value: number) => value,
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
      from: (value: string) => Number(value),
      to: (value: number) => value,
    },
  })
  tradeValue!: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'from_address' })
  fromUser!: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'to_address' })
  toUser!: User;

  @Column({ type: 'json' })
  data!: ZapperNode;
}
