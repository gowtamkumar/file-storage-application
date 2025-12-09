import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { User } from './user.entity';

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  plan: string;

  @Column({ nullable: true })
  planRef: string;

  @ManyToOne(() => SubscriptionPlan, { nullable: true })
  @JoinColumn({ name: 'planRef' })
  subscriptionPlan: SubscriptionPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column()
  storageLimit: number;

  @Column()
  fileLimit: number;

  @Column('jsonb', { default: {} })
  features: Record<string, boolean>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
