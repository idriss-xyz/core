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
  @PrimaryColumn()
  id!: number;

  @OneToOne(() => Donation, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'id' })
  base!: Donation;

  @Column({ name: 'nft_token_id' })
  nftTokenId!: number;

  @ManyToOne(() => NftToken, { eager: true })
  @JoinColumn({ name: 'nft_token_id' })
  nft!: NftToken;

  @Column({ type: 'integer' })
  quantity!: number;
}
