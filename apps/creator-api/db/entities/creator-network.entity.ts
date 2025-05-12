import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Creator } from './creator.entity';

@Entity('creator_networks')
export class CreatorNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chainId!: number;

  @ManyToOne(() => Creator, (creator) => creator.networks)
  creator!: Creator;
}
