import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('folders')
@Index(['name', 'userId', 'parentId'], { unique: true })
export class Folder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  parentId: string;

  @ManyToOne(() => Folder, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Folder;

  @CreateDateColumn()
  createdAt: Date;
}
