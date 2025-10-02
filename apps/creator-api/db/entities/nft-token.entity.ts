import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Hex } from 'viem';
import { NftCollection } from './nft-collection.entity';
import { NftDonation } from './nft-donation.entity';

@Entity('nft_tokens')
@Index(['collectionAddress', 'network', 'tokenId'], { unique: true })
export class NftToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'collection_address', type: 'text' })
  collectionAddress!: Hex;

  @Column({ type: 'text' })
  network!: string;

  @Column({ name: 'token_id', type: 'bigint' })
  tokenId!: number;

  @ManyToOne(() => NftCollection, (c) => c.tokens, { eager: true })
  @JoinColumn([
    { name: 'collection_address', referencedColumnName: 'address' },
    { name: 'network', referencedColumnName: 'network' },
  ])
  collection!: NftCollection;

  @Column({ type: 'text' })
  name!: string;

  @Column({ name: 'img_small', type: 'text', nullable: true })
  imgSmall?: string;

  @Column({ name: 'img_medium', type: 'text', nullable: true })
  imgMedium?: string;

  @Column({ name: 'img_large', type: 'text', nullable: true })
  imgLarge?: string;

  @Column({ name: 'img_preferred', type: 'text', nullable: true })
  imgPreferred?: string;

  @OneToMany(() => NftDonation, (d) => d.nft)
  donations!: NftDonation[];
}
