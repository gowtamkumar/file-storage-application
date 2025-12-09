import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './config/database.config';
import { AdminModule } from './modules/admin/admin.module';
import { AdvertisementsModule } from './modules/advertisements/advertisements.module';
import { AuthModule } from './modules/auth/auth.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { FilesModule } from './modules/files/files.module';
import { FoldersModule } from './modules/folders/folders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PagesModule } from './modules/pages/pages.module';
import { PublicFilesModule } from './modules/public-files/public-files.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SubscriptionsModule } from './modules/subscriptions/subscriptions.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    AuthModule,
    UsersModule,
    FilesModule,
    FoldersModule,
    SubscriptionsModule,
    AdminModule,
    PublicFilesModule,
    NotificationsModule,
    AdvertisementsModule,
    ContactsModule,
    PagesModule,
    SettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
