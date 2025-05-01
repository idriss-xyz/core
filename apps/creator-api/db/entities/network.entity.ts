import { Entity, PrimaryColumn, ManyToMany, Column } from 'typeorm';
import { Creator } from './creator.entity';

@Entity('network')
export class Network {
  @PrimaryColumn()
  id!: number;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl?: string;

  @ManyToMany(() => Creator, (creator) => creator.networks)
  creators!: Creator[];
}
