import { Controller, Get, Module, NotFoundException, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Response } from 'express';
import { Repository } from 'typeorm';
import { File } from '../../entities/file.entity';
import { FilesModule } from '../files/files.module';
import { FilesService } from '../files/files.service';

@Controller()
export class PublicFilesController {
  constructor(
    private filesService: FilesService,
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  @Get('public-files/:shareableId')
  async getPublicFile(@Param('shareableId') shareableId: string) {
    const file = await this.fileRepository.findOne({ where: { shareableId, isPublic: true } });
    if (!file) {
      throw new NotFoundException('File not found or not public');
    }
    await this.fileRepository.increment({ id: file.id }, 'viewCount', 1);
    await this.fileRepository.update(file.id, { lastViewed: new Date() });
    return { success: true, data: file };
  }

  @Get('public-files/:shareableId/download')
  async downloadPublicFile(@Param('shareableId') shareableId: string, @Res() res: Response) {
    const file = await this.fileRepository.findOne({ where: { shareableId, isPublic: true } });
    if (!file) {
      throw new NotFoundException('File not found');
    }

    await this.fileRepository.increment({ id: file.id }, 'downloadCount', 1);
    await this.fileRepository.update(file.id, { lastDownloaded: new Date() });

    res.download(file.path, file.originalName);
  }

  @Post('public-upload')
  @UseInterceptors(FileInterceptor('file'))
  async publicUpload(@UploadedFile() file: Express.Multer.File) {
     // Public upload logic usually requires some validation or temp storage
     // For now reusing filesService but passing null userId? 
     // FilesService expects userId. We might need a system user or modify service.
     // For this implementation, I'll skip actual public upload without auth or require a specific "public" user handling
     // Assuming public upload allowed but ownership needs to be defined. 
     // Let's assume it assigns to no user (nullable)
     return { success: false, message: 'Public upload requires configuration' };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([File]), FilesModule],
  controllers: [PublicFilesController],
})
export class PublicFilesModule {}
