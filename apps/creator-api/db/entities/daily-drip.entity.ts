import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Creator } from './creator.entity';

@Entity('drip_daily_claim')
@Unique('uniq_creator_chain_day', ['creatorId', 'chainId', 'day'])
export class DripDailyClaim {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'creator_id' })
  creatorId!: number;

  @ManyToOne(() => Creator, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;

  @Column({ type: 'int', name: 'chain_id' })
  chainId!: number;

  @Column({ type: 'date' })
  day!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;
}
