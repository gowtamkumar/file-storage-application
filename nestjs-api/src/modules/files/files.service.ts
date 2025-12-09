import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { File } from '../../entities/file.entity';
import { Folder } from '../../entities/folder.entity';

@Injectable()
export class FilesService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(userId: string, file: Express.Multer.File, folderId?: string, isPublic = false) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Create unique filename
      const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
      const fileExt = path.extname(file.originalname);
      const filename = `${uniqueSuffix}${fileExt}`;
      const filePath = path.join(this.uploadDir, filename);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create file record
      const newFile = this.fileRepository.create({
        filename: filename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype,
        userId: userId,
        folderId: folderId || null,
        isPublic: isPublic,
      });

      return await this.fileRepository.save(newFile);
    } catch (error) {
      console.error('Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async findAll(userId: string, folderId: string | null = null) {
    const query = this.fileRepository.createQueryBuilder('file')
      .leftJoinAndSelect('file.folder', 'folder')
      .where('file.userId = :userId', { userId });

    if (folderId !== null) {
      query.andWhere('file.folderId = :folderId', { folderId });
    } else {
      query.andWhere('file.folderId IS NULL');
    }

    return await query.orderBy('file.createdAt', 'DESC').getMany();
  }

  async findOne(id: string, userId: string) {
    const file = await this.fileRepository.findOne({ where: { id, userId } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async delete(id: string, userId: string) {
    const file = await this.findOne(id, userId);
    
    // Delete from disk
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete from db
    return await this.fileRepository.remove(file);
  }

  async update(id: string, userId: string, updateData: Partial<File>) {
    await this.findOne(id, userId); // Ensure exists and belongs to user
    await this.fileRepository.update(id, updateData);
    return await this.findOne(id, userId);
  }
}
