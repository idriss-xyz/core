import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';

import { Donation } from './donations.entity';
import { NftToken } from './nft-token.entity';

@Entity('creator_nft_donations')
export class NftDonation {
  @PrimaryColumn({ type: 'integer' })
  id!: number;

  @OneToOne(
    () => {
      return Donation;
    },
    { onDelete: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'id' })
  base!: Donation;

  @Column({ name: 'nft_token_id', type: 'integer' })
  nftTokenId!: number;

  @ManyToOne(
    () => {
      return NftToken;
    },
    { eager: true },
  )
  @JoinColumn({ name: 'nft_token_id' })
  nft!: NftToken;

  @Column({ type: 'integer' })
  quantity!: number;
}
