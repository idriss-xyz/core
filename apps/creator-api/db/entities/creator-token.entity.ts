import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Creator } from './creator.entity';

@Entity('creator_tokens')
export class CreatorToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chainId!: number;

  @ManyToOne(() => Creator, (creator) => creator.tokens)
  creator!: Creator;
}
