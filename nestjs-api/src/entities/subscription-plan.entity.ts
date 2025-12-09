import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum PlanInterval {
  MONTH = 'month',
  YEAR = 'year',
  FOREVER = 'forever',
}

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  planId: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PlanInterval,
    default: PlanInterval.MONTH,
  })
  interval: PlanInterval;

  @Column('text')
  description: string;

  @Column('jsonb', { default: [] })
  features: string[];

  @Column('jsonb')
  limits: {
    storage: number;
    files: number;
  };

  @Column({ default: false })
  @Index()
  highlighted: boolean;

  @Column({ default: true })
  @Index()
  active: boolean;

  @Column({ default: 0 })
  @Index()
  displayOrder: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
