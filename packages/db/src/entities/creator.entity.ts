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
import { CreatorFollowedChannel } from './creator-followed-channel.entity';

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

  @OneToOne(
    () => {
      return TwitchInfo;
    },
    { nullable: false },
  )
  @JoinColumn({ name: 'twitch_id', referencedColumnName: 'twitchId' })
  twitchInfo!: TwitchInfo;

  @Column({ type: 'text', name: 'goal_url', nullable: true })
  goalUrl?: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'joined_at' })
  joinedAt!: Date;

  @Column({ type: 'boolean', name: 'done_setup' })
  doneSetup!: boolean;

  @Column({ type: 'boolean', name: 'receive_emails', default: true })
  receiveEmails!: boolean;

  @Column({
    type: 'boolean',
    name: 'force_donation_overlay_refresh',
    default: false,
  })
  forceDonationOverlayRefresh!: boolean;

  @Column({ type: 'boolean', name: 'is_donor', default: false })
  isDonor!: boolean;

  @Column({ type: 'boolean', name: 'display_top_donor', default: true })
  displayTopDonor!: boolean;

  @OneToMany(
    () => {
      return CreatorNetwork;
    },
    (network) => {
      return network.creator;
    },
  )
  networks!: CreatorNetwork[];

  @OneToMany(
    () => {
      return CreatorToken;
    },
    (token) => {
      return token.creator;
    },
  )
  tokens!: CreatorToken[];

  @OneToMany(
    () => {
      return CreatorAddress;
    },
    (address) => {
      return address.creator;
    },
  )
  associatedAddresses!: CreatorAddress[];

  @OneToMany(
    () => {
      return CreatorFollowedChannel;
    },
    (c) => {
      return c.creator;
    },
  )
  followedChannels!: CreatorFollowedChannel[];
}
