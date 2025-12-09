import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FilesService } from './files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
    @Body('folderId') folderId?: string,
    @Body('isPublic') isPublic?: string,
  ) {
    const isPublicBool = isPublic === 'true';
    return this.filesService.uploadFile(req.user.id, file, folderId, isPublicBool);
  }

  @Get()
  async findAll(@Request() req, @Query('folderId') folderId?: string) {
    const actualFolderId = folderId === 'null' || folderId === '' ? null : folderId;
    const files = await this.filesService.findAll(req.user.id, actualFolderId);
    return { success: true, data: files };
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const file = await this.filesService.findOne(id, req.user.id);
    return { success: true, data: file };
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    const file = await this.filesService.update(id, req.user.id, updateData);
    return { success: true, data: file };
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.filesService.delete(id, req.user.id);
    return { success: true, message: 'File deleted successfully' };
  }

  @Put(':id/move')
  async move(@Request() req, @Param('id') id: string, @Body('folderId') folderId: string) {
    const file = await this.filesService.moveFile(id, req.user.id, folderId);
    return { success: true, data: file };
  }
}
