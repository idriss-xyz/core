import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('twitch_tokens')
export class TwitchTokens {
  @PrimaryColumn({ type: 'text', name: 'twitch_id' })
  twitchId!: string;

  @Column({ type: 'text', name: 'access_token' })
  accessToken!: string;

  @Column({ type: 'text', name: 'refresh_token' })
  refreshToken!: string;
}
