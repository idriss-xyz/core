import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('mobile_signup_email')
export class MobileSignupEmail {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'text', unique: true })
  email!: string;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt!: Date;

  @Column({
    type: 'timestamp with time zone',
    name: 'converted_at',
    nullable: true,
  })
  convertedAt?: Date;

  @Column({ type: 'boolean', name: 'email_sent', default: false })
  emailSent!: boolean;

  @Column({
    type: 'timestamp with time zone',
    name: 'email_sent_at',
    nullable: true,
  })
  emailSentAt?: Date;
}
