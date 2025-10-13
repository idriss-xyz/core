import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'text' })
  address!: Hex;

  @Column({ type: 'text', nullable: true, name: 'display_name' })
  displayName?: string;

  @Column({ type: 'text', nullable: true, name: 'display_name_source' })
  displayNameSource?: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_url' })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true, name: 'avatar_source' })
  avatarSource?: string;
}
