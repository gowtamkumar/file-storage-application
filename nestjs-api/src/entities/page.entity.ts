import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('pages')
export class Page {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column('text')
  content: string;

  @Column({ length: 160, nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  keywords: string;

  @Column({ nullable: true })
  ogImage: string;

  @Column({ nullable: true })
  canonicalUrl: string;

  @Column({ default: false })
  isPublished: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
