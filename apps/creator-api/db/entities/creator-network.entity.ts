import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Creator } from './creator.entity';

@Entity('creator_networks')
export class CreatorNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chainName!: string;

  @ManyToOne(() => Creator, (creator) => creator.networks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
