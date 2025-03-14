import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ZapperNode } from '../../types';
import { Hex } from 'viem';

@Entity('creator_donations')
export class Donation {
  @PrimaryColumn({ type: 'text', name: 'transaction_hash' })
  transactionHash!: Hex;

  @Column({ type: 'text', name: 'from_address' })
  fromAddress!: Hex;

  @Column({ type: 'text', name: 'to_address' })
  toAddress!: Hex;

  @Column({ type: 'bigint', name: 'timestamp' })
  timestamp!: number;

  @Column({ type: 'json' })
  data!: ZapperNode;
}
