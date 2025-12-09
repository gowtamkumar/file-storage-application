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
     if (!file) {
         throw new NotFoundException('No file uploaded');
     }
     // Pass null for userId, null for folderId, true for isPublic
     const uploaded = await this.filesService.uploadFile(null, file, undefined, true);
     
     // Construct shareable URL matching Next.js format
     const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 4000}`;
     const shareableUrl = `${baseUrl}/share/${uploaded.shareableId}`;

     return {
         success: true,
         data: {
             file: uploaded,
             shareableUrl,
             shareableId: uploaded.shareableId
         }
     };
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([File]), FilesModule],
  controllers: [PublicFilesController],
})
export class PublicFilesModule {}
