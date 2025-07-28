import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
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

  @Column({ type: 'text', unique: true })
  name!: string;

  @Column({ type: 'text', name: 'display_name', unique: true })
  displayName!: string;

  @Column({ type: 'text', name: 'privy_id', unique: true })
  privyId!: string;

  @Column({ type: 'text', name: 'profile_picture_url', nullable: true })
  profilePictureUrl?: string;

  @Column({ type: 'text', nullable: true, unique: true })
  email?: string;

  @Column({ type: 'text', name: 'donation_url', nullable: true })
  donationUrl?: string;

  @Column({ type: 'text', name: 'obs_url', nullable: true })
  obsUrl?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'joined_at' })
  joinedAt!: Date;

  @Column({ type: 'boolean', name: 'done_setup' })
  doneSetup!: Boolean;

  @Column({ type: 'boolean', name: 'receive_emails' })
  receiveEmails?: Boolean;

  @OneToMany(() => CreatorNetwork, (network) => network.creator)
  networks!: CreatorNetwork[];

  @OneToMany(() => CreatorToken, (token) => token.creator)
  tokens!: CreatorToken[];
}
