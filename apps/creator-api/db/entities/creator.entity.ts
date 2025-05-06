import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Hex } from 'viem';
import { Network } from './network.entity';

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

  @ManyToMany(() => Network, (network) => network.creators)
  networks!: Network[];
}
