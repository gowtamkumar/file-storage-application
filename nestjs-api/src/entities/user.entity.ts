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

  @CreateDateColumn()
  createdAt: Date;
}
