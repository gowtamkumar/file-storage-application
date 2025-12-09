import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Subscription } from './subscription.entity';
import { User } from './user.entity';

export enum TransactionStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  planId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ default: 'unknown' })
  paymentMethod: string;

  @Column({ unique: true })
  transactionId: string;

  @Column()
  subscriptionId: string;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;

  @Column({
    type: 'enum',
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column('jsonb', { default: {} })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
