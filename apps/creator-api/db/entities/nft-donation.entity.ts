import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';
import { Donation } from './donations.entity';

@Entity('creator_nft_donations')
export class NftDonation {
  @PrimaryColumn()
  id!: number;

  @OneToOne(() => Donation, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id' })
  base!: Donation;

  @Column({ name: 'collection_address', type: 'text' })
  collectionAddress!: Hex;

  @Column({ type: 'text' })
  network!: string;

  @Column({ name: 'token_id', type: 'bigint' })
  tokenId!: number;

  @Column({ name: 'quantity', type: 'integer' })
  quantity!: number;

  @Column({ name: 'name', type: 'text' })
  name!: string;

  @Column({ name: 'image_url', type: 'text' })
  imageUrl!: string;
}
