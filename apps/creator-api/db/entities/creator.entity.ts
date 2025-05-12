import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Hex } from 'viem';
import { CreatorNetwork } from './creator-network.entity';
import { CreatorToken } from './creator-token.entity';

@Entity('creator')
export class Creator {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  address!: Hex;

  @Column({ type: 'text', name: 'primary_address', unique: true })
  primaryAddress!: Hex;

  @Column({ type: 'text' })
  name!: string;

  @Column({ type: 'text', name: 'profile_picture_url', nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'text', name: 'donation_url', nullable: true })
  donationUrl?: string;

  @Column({ type: 'text', name: 'obs_url', nullable: true })
  obsUrl?: string;

  @OneToMany(() => CreatorNetwork, (network) => network.creator)
  networks!: CreatorNetwork[];

  @OneToMany(() => CreatorToken, (token) => token.creator)
  tokens!: CreatorToken[];
}
