import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('environment')
export class Environment {
  @PrimaryColumn({ type: 'text', name: 'key' })
  key!: string;

  @Column({ type: 'text', name: 'value' })
  value!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
