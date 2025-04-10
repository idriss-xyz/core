import { Column, Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Hex } from 'viem';
import { User } from './user.entity';
import { Token } from './token.entity';
import { ZapperNode } from '../../types';

@Entity('creator_donations')
export class Donation {
  @PrimaryColumn({ type: 'text', name: 'transaction_hash' })
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

  @ManyToOne(() => Token)
  @JoinColumn([
    { name: 'token_address', referencedColumnName: 'address' },
    { name: 'network', referencedColumnName: 'network' },
  ])
  token!: Token;

  @Column({ type: 'text', name: 'token_address' })
  tokenAddress!: Hex;

  @Column({ type: 'text' })
  network!: string;

  @Column({ type: 'text', name: 'amount_raw' })
  amountRaw!: string;

  @Column({ type: 'json' })
  data!: ZapperNode;
}
