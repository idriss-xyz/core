import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';
import { Creator } from './creator.entity';

@Entity('tokens')
export class Token {
  @PrimaryColumn({ type: 'text' })
  address!: Hex;

  @Column({ type: 'text' })
  symbol!: string;

  @Column({ type: 'text', name: 'image_url', nullable: true })
  imageUrl?: string;

  @Column({ type: 'text' })
  network!: string;

  @Column({ type: 'integer' })
  decimals!: number;

  @ManyToMany(() => Creator, (creator) => creator.networks)
  creators!: Creator[];
}
