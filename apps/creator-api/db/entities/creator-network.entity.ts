import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Creator } from './creator.entity';

@Entity('creator_networks')
export class CreatorNetwork {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  chainId!: number;

  @ManyToOne(() => Creator, (creator) => creator.networks)
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;
}
