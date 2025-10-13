import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';

import { NftToken } from './nft-token.entity';

@Entity('nft_collections')
@Index(['address', 'network'], { unique: true })
export class NftCollection {
  @PrimaryColumn({ type: 'text' })
  address!: Hex;

  @PrimaryColumn({ type: 'text' })
  network!: string;
  @Column({ type: 'text' })
  name!: string;

  @Column({ name: 'short_name', type: 'text' })
  shortName!: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl!: string;

  @Column({ type: 'text' })
  slug!: string;

  @Column({ type: 'text' })
  category!: string;

  @OneToMany(
    () => {
      return NftToken;
    },
    (token) => {
      return token.collection;
    },
  )
  tokens!: NftToken[];
}
