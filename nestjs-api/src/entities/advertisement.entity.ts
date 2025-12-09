import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum AdType {
  LOCAL = 'local',
  GOOGLE = 'google',
}

@Entity('advertisements')
export class Advertisement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  title: string;

  @Column({
    type: 'enum',
    enum: AdType,
  })
  type: AdType;

  @Column({ default: 'everywhere' })
  placement: string;

  // Local Ads
  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl: string;

  // Google Ads
  @Column({ nullable: true })
  adCode: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;
}
