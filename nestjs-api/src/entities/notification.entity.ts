import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  message: string;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Column()
  recipient: string; // 'all' or userId

  @ManyToMany(() => User)
  @JoinTable({
    name: 'notification_read_by',
    joinColumn: { name: 'notificationId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'userId', referencedColumnName: 'id' },
  })
  readBy: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
