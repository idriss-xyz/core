import { Column, Entity, PrimaryColumn } from 'typeorm';

import type { ZapperNode } from '@/app/creators/donate-history/types';

@Entity('creator_donations')
export class Donation {
  @PrimaryColumn({ type: 'text', name: 'transaction_hash' })
  transactionHash!: string;

  @Column({ type: 'text', name: 'from_address' })
  fromAddress!: string;

  @Column({ type: 'text', name: 'to_address' })
  toAddress!: string;

  @Column({ type: 'bigint', name: 'timestamp' })
  timestamp!: number;

  @Column({ type: 'json' })
  data!: ZapperNode;
}
