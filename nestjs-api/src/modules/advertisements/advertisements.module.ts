import { Controller, Get, Module, Param, Post } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Advertisement } from '../../entities/advertisement.entity';

// Controller (Inline for brevity as logic is simple)
@Controller('ads')
export class AdvertisementsController {
  constructor(
    @InjectRepository(Advertisement)
    private adsRepository: Repository<Advertisement>,
  ) {}

  @Get('public')
  async getPublicAds() {
    const ads = await this.adsRepository.find({ where: { isActive: true } });
    return { success: true, data: ads };
  }

  @Post('track/:id')
  async trackAd(@Param('id') id: string) {
    await this.adsRepository.increment({ id }, 'clicks', 1);
    return { success: true };
  }

  // Admin endpoints would go here or in Admin module
}

@Module({
  imports: [TypeOrmModule.forFeature([Advertisement])],
  controllers: [AdvertisementsController],
  exports: [TypeOrmModule], // Export repo for Admin module
})
export class AdvertisementsModule {}
