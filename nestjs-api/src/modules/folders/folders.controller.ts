import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { FoldersService } from './folders.service';

@Controller('folders')
@UseGuards(JwtAuthGuard)
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) {}

  @Post()
  async create(@Request() req, @Body() createFolderDto: any) {
    const folder = await this.foldersService.create(req.user.id, createFolderDto);
    return { success: true, data: folder };
  }

  @Get()
  async findAll(@Request() req) {
    const folders = await this.foldersService.findAll(req.user.id);
    return { success: true, data: folders };
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const folder = await this.foldersService.findOne(id, req.user.id);
    return { success: true, data: folder };
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() updateData: any) {
    const folder = await this.foldersService.update(id, req.user.id, updateData);
    return { success: true, data: folder };
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.foldersService.delete(id, req.user.id);
    return { success: true, message: 'Folder deleted successfully' };
  }
}
