import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { Creator } from './creator.entity';

// todo: fix circular dependency with creator
@Entity('creator_networks')
export class CreatorNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text' })
  chainName!: string;

  @ManyToOne(
    () => {
      return Creator;
    },
    (creator) => {
      return creator.networks;
    },
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
