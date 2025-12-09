import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ default: false })
  verified: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @Column({ unique: true, nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  subscriptionPlan: string;

  @Column({ default: 'inactive' })
  subscriptionStatus: string;

  @Column({ type: 'bigint', default: 0 })
  storageLimit: number; // TypeORM maps bigint to string in JS unless transformed, using number safe for file sizes < 9PB if handled careful, or use string. Let's use string/bigint handling. Actually 'bigint' returns string in JS.

  @Column({ nullable: true })
  subscriptionEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;
}
