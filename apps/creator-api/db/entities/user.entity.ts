import { Column, Entity, PrimaryColumn } from 'typeorm';
import { Hex } from 'viem';

@Entity('users')
export class User {
  @PrimaryColumn({ type: 'text' })
  address!: Hex;

  @Column({ type: 'text', nullable: true })
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  displayNameSource?: string;

  @Column({ type: 'text', nullable: true })
  avatarUrl?: string;

  @Column({ type: 'text', nullable: true })
  avatarSource?: string;
}
