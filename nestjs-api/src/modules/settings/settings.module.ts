import { Body, Controller, Get, Module, Post, Request, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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

  @UseGuards(JwtAuthGuard)
  @Post('site')
  async updateSettings(@Request() req, @Body() body: any) {
    if (req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    let settings = await this.settingsRepository.findOne({ where: {} });
    if (settings) {
         await this.settingsRepository.update(settings.id, body);
         settings = await this.settingsRepository.findOne({ where: { id: settings.id } });
    } else {
         settings = (await this.settingsRepository.save(this.settingsRepository.create(body))) as unknown as SiteSettings;
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
