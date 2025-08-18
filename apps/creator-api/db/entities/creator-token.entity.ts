import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Creator } from './creator.entity';

@Entity('creator_tokens')
export class CreatorToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  tokenSymbol!: string;

  @ManyToOne(() => Creator, (creator) => creator.tokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
