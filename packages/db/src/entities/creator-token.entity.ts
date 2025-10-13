import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { Creator } from './creator.entity';

// todo: fix circular dependency with creator
@Entity('creator_tokens')
export class CreatorToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tokenSymbol!: string;

  @ManyToOne(
    () => {
      return Creator;
    },
    (creator) => {
      return creator.tokens;
    },
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
