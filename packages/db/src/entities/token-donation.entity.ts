import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { Hex } from 'viem';

import { Donation } from './donations.entity';
import { Token } from './token.entity';

@Entity('creator_token_donations')
export class TokenDonation {
  /* share PK with parent row */
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @OneToOne(
    () => {
      return Donation;
    },
    { onDelete: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'id' })
  base!: Donation;

  @Column({ name: 'token_address', type: 'text' })
  tokenAddress!: Hex;

  @Column({ type: 'text' })
  network!: string;

  @Column({ name: 'amount_raw', type: 'numeric' })
  amountRaw!: string;

  @ManyToOne(
    () => {
      return Token;
    },
    { eager: true },
  )
  @JoinColumn([
    { name: 'token_address', referencedColumnName: 'address' },
    { name: 'network', referencedColumnName: 'network' },
  ])
  token!: Token;
}
