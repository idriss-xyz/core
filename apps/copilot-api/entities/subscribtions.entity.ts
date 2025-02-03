import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { SubscribersEntity } from './subscribers.entity';
import { AddressesEntity } from './addresses.entity';

@Entity('subscriptions')
export class SubscriptionsEntity {
  @PrimaryColumn({ type: 'text', name: 'subscriber_id' })
  readonly subscriber_id!: string;

  @PrimaryColumn({ type: 'text', name: 'address' })
  readonly address!: string;

  @Column({ type: 'integer', name: 'fid', nullable: true })
  readonly fid!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  readonly created_at!: Date;

  @ManyToOne(() => SubscribersEntity)
  @JoinColumn({ name: 'subscriber_id' })
  readonly subscriber!: SubscribersEntity;

  @ManyToOne(() => AddressesEntity)
  @JoinColumn({ name: 'address' })
  readonly addressEntity!: AddressesEntity;
}
