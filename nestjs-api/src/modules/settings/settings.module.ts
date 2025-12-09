import { Controller, Get, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteSettings } from '../../entities/site-settings.entity';

@Controller('settings')
export class SettingsController {
  constructor(
    @InjectRepository(SiteSettings)
    private settingsRepository: Repository<SiteSettings>,
  ) {}

  @Get('site')
  async getSettings() {
    let settings = await this.settingsRepository.findOne({ where: {} });
    if (!settings) {
      // Return defaults or create
       settings = await this.settingsRepository.save(this.settingsRepository.create({}));
    }
    return { success: true, data: settings };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([SiteSettings])],
  controllers: [SettingsController],
  exports: [TypeOrmModule], // For Admin
})
export class SettingsModule {}
