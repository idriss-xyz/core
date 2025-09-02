import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Hex } from 'viem';
import { CreatorAddress } from './creator-address.entity';
import { CreatorNetwork } from './creator-network.entity';
import { CreatorToken } from './creator-token.entity';
import { TwitchInfo } from './twitch-info.entity';

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

  @Column({ type: 'text', name: 'twitch_id', nullable: false, unique: true })
  twitchId!: string;

  @OneToOne(() => TwitchInfo, { nullable: false })
  @JoinColumn({ name: 'twitch_id', referencedColumnName: 'twitchId' })
  twitchInfo!: TwitchInfo;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'joined_at' })
  joinedAt!: Date;

  @Column({ type: 'boolean', name: 'done_setup' })
  doneSetup!: Boolean;

  @Column({ type: 'boolean', name: 'receive_emails', default: true })
  receiveEmails!: Boolean;

  @Column({
    type: 'boolean',
    name: 'force_donation_overlay_refresh',
    default: false,
  })
  forceDonationOverlayRefresh!: Boolean;

  @OneToMany(() => CreatorNetwork, (network) => network.creator)
  networks!: CreatorNetwork[];

  @OneToMany(() => CreatorToken, (token) => token.creator)
  tokens!: CreatorToken[];

  @OneToMany(() => CreatorAddress, (address) => address.creator)
  associatedAddresses!: CreatorAddress[];
}
