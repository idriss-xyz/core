import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from 'typeorm';
import { Hex } from 'viem';
import { Creator } from './creator.entity';

// todo: fix circular dependency with creator
@Entity('creator_address')
export class CreatorAddress {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  address!: Hex;

  @ManyToOne(() => Creator, (creator) => creator.associatedAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
