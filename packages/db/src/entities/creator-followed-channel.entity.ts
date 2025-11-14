import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';

import { Creator } from './creator.entity';

@Entity('creator_followed_channel')
@Unique(['creator', 'channelName'])
@Unique(['creator', 'channelTwitchId'])
export class CreatorFollowedChannel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => {
      return Creator;
    },
    (creator) => {
      return creator.id;
    },
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'creator_id' })
  creator!: Creator;

  @Column({ type: 'text', name: 'channel_name' })
  channelName!: string;

  @Column({ type: 'text', name: 'channel_display_name', nullable: true })
  channelDisplayName?: string;

  @Column({ type: 'text', name: 'channel_twitch_id' })
  channelTwitchId!: string;

  @Column({ type: 'text', name: 'channel_profile_image_url', nullable: true })
  channelProfileImageUrl?: string;
}
