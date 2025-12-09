import { Controller, Get, Module, NotFoundException, Param } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../../entities/page.entity';

@Controller('pages')
export class PagesController {
  constructor(
    @InjectRepository(Page)
    private pagesRepository: Repository<Page>,
  ) {}

  @Get('public/:slug')
  async getPage(@Param('slug') slug: string) {
    const page = await this.pagesRepository.findOne({ where: { slug, isPublished: true } });
    if (!page) {
      throw new NotFoundException('Page not found');
    }
    return { success: true, data: page };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [PagesController],
  exports: [TypeOrmModule], // For Admin
})
export class PagesModule {}
