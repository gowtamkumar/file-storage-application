import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Folder } from './folder.entity';
import { User } from './user.entity';

@Entity('files')
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  originalName: string;

  @Column()
  path: string;

  @Column('bigint')
  size: number;

  @Column()
  mimetype: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ nullable: true })
  folderId: string;

  @ManyToOne(() => Folder, { nullable: true })
  @JoinColumn({ name: 'folderId' })
  folder: Folder;

  @Column({ default: false })
  isPublic: boolean;

  @Column({ unique: true, nullable: true })
  @Index({ unique: true, where: '("shareableId" IS NOT NULL)' })
  shareableId: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  downloadCount: number;

  @Column({ nullable: true })
  lastViewed: Date;

  @Column({ nullable: true })
  lastDownloaded: Date;

  @Column({ default: false })
  isCompressed: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
