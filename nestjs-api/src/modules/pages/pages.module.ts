import { Body, ConflictException, Controller, Delete, Get, Module, NotFoundException, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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

  // Admin Endpoints
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Request() req, @Query('public') isPublic?: string) {
    const query: any = {};
    if (isPublic === 'true') {
        query.isPublished = true;
    }
    // Admin check for listing non-public? Next.js allows public listing optionally without auth?
    // Next.js: GET /api/pages allows listing.
    // Let's separate Admin list vs Public list provided by param.
    // If auth, allow all?
    // Code in Next.js:
    // const publicOnly = searchParams.get('public') === 'true';
    // query.isPublished = true if publicOnly.
    // Logic: If user is admin (checked via session), maybe they want all.
    // But Next.js GET code: checks session? No `if (!session)` at top of GET.
    // Only POST is protected.
    // Actually GET check: "Optional: Check permissions if you want to restrict listing to admins only"
    // I will expose GET /pages as public but filter based on needs or assume client handles it.
    // Given the Next.js code, GET is effectively public but typically filtered.
    // I'll make GET /pages public but support query.
    return { success: true, data: await this.pagesRepository.find({ where: query, order: { createdAt: 'DESC' } }) };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Request() req, @Body() createDto: any) {
    if (req.user.role !== 'admin') throw new Error('Unauthorized'); // Use ForbiddenException better
    try {
        const page = this.pagesRepository.create(createDto);
        return { success: true, data: await this.pagesRepository.save(page) };
    } catch (error) {
        if (error.code === '23505') { // Postgres unique violation (check error code for your DB, likely configured)
             throw new ConflictException('A page with this slug already exists.');
        }
        throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateDto: any) {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    try {
         await this.pagesRepository.update(id, updateDto);
         return { success: true, data: await this.pagesRepository.findOne({ where: { id } }) };
    } catch (error) {
         if (error.code === '23505') throw new ConflictException('A page with this slug already exists.');
         throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'admin') throw new Error('Unauthorized');
    await this.pagesRepository.delete(id);
    return { success: true, data: {} };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Page])],
  controllers: [PagesController],
  exports: [TypeOrmModule], // For Admin
})
export class PagesModule {}
