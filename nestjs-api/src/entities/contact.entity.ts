import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ContactStatus {
  NEW = 'new',
  READ = 'read',
  REPLIED = 'replied',
}

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column()
  email: string;

  @Column({ length: 100 })
  subject: string;

  @Column({ length: 1000 })
  message: string;

  @Column({
    type: 'enum',
    enum: ContactStatus,
    default: ContactStatus.NEW,
  })
  status: ContactStatus;

  @CreateDateColumn()
  createdAt: Date;
}
