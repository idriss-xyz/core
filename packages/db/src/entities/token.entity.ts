import { Column, Entity, Index, ManyToMany, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';

import { Creator } from './creator.entity';

@Entity('tokens')
@Index(['address', 'network'], { unique: true })
export class Token {
  @PrimaryColumn({ type: 'text' })
  address!: Hex;

  @PrimaryColumn({ type: 'text' })
  network!: string;

  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ type: 'integer' })
  decimals!: number;

  @ManyToMany(
    () => {
      return Creator;
    },
    (creator) => {
      return creator.networks;
    },
  )
  creators!: Creator[];
}
