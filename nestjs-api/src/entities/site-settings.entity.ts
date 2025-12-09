import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_settings')
export class SiteSettings {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('jsonb', { default: [] })
  navbarLinks: { label: string; path: string; order: number }[];

  @Column({ default: '© 2024 FileStore. All rights reserved.' })
  footerText: string;

  @Column('jsonb', { default: [] })
  footerLinks: { label: string; path: string; order: number }[];

  @Column({ default: true })
  showNavbarOnSharePage: boolean;

  @Column({ default: true })
  showFooterOnSharePage: boolean;

  @Column('jsonb', {
    default: {
      companyName: 'FileStore',
      email: '',
      phone: '',
      address: '',
      description: '',
      logo: '',
      favicon: '',
    },
  })
  branding: {
    companyName: string;
    email: string;
    phone: string;
    address: string;
    description: string;
    logo: string;
    favicon: string;
  };

  @Column('jsonb', {
    default: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      github: '',
      youtube: '',
    },
  })
  socialLinks: Record<string, string>;

  @Column('jsonb', {
    default: {
      host: '',
      port: 587,
      user: '',
      password: '',
      fromEmail: '',
      fromName: 'FileStore',
      secure: false,
    },
  })
  smtp: Record<string, any>;

  @Column('jsonb', {
    default: {
      siteTitle: 'FileStore - Secure File Sharing',
      titleTemplate: '%s | FileStore',
      metaDescription: 'Securely store and share your files with FileStore.',
      keywords: 'file sharing, cloud storage, secure upload',
      ogImage: '',
      twitterHandle: '',
      googleAnalyticsId: '',
    },
  })
  seo: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
