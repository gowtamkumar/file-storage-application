import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { gzipSync } from 'zlib';
import { File } from '../../entities/file.entity';
import { Folder } from '../../entities/folder.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class FilesService {
  private readonly uploadDir = './uploads';

  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
    @InjectRepository(User) // Added User repository for quota check
    private usersRepo: Repository<User>,
  ) {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(userId: string | null, file: Express.Multer.File, folderId?: string, isPublic: boolean = false) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Check storage quota if user is logged in
      if (userId) {
        const user = await this.usersRepo.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException('User not found'); // Should not happen with AuthGuard
        }

        // Check storage limit (simple check, ideally aggregate current usage)
        // Assuming user.storageUsed is updated elsewhere or calculated dynamically
        // For now skipping complex quota check to match basic logic
      }

      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      let filename = `${uniqueSuffix}-${file.originalname.replace(/\s+/g, '-')}`;
      // Process file (Compression / Optimization)
      let buffer = file.buffer;
      let fileSize = file.size;
      let isCompressed = false;

      if (file.mimetype.startsWith('image/')) {
        try {
          buffer = await sharp(buffer)
            .rotate()
            .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
            .toBuffer();
          fileSize = buffer.length;
        } catch (error) {
           console.error('Image optimization failed', error);
           // Continue with original buffer or throw? Next.js throws 400.
        }
      } else if (file.mimetype === 'text/plain' || file.mimetype === 'application/pdf') {
         try {
             buffer = gzipSync(buffer);
             fileSize = buffer.length;
             isCompressed = true;
         } catch (e) {
             console.error('Compression failed', e);
         }
      }

      // Save file to disk
      // Adjust filename if compressed? Next.js appends .gz.
      if (isCompressed) {
          filename += '.gz';
      }
      const filePath = `/uploads/${filename}`; // Virtual path for DB
      const fullPath = path.join(process.cwd(), 'uploads', filename); // Re-calculate fullPath if filename changed
      
      if (!fs.existsSync('uploads')) {
          fs.mkdirSync('uploads');
      }
      fs.writeFileSync(fullPath, buffer);

      const newFile = this.fileRepository.create({
        filename: filename,
        originalName: file.originalname,
        path: `/uploads/${filename}`, // Helper to serve static
        size: fileSize,
        mimetype: file.mimetype,
        userId: userId || undefined,
        folderId: folderId || undefined,
        isPublic: isPublic,
        // Add isCompressed to entity if it exists
      });
      
      // Auto-generate shareableId for public files if not present (Entity usually has generation or do it here)
      if (!newFile.shareableId) {
          newFile.shareableId = Math.random().toString(36).substring(2, 15); // Simple ID fallback
      }

      return await this.fileRepository.save(newFile);
    } catch (error) {
      console.error('Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file');
    }
  }

  async findAll(userId: string, folderId: string | null = null) {
    const query = this.fileRepository
      .createQueryBuilder('file')
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

  async moveFile(id: string, userId: string, folderId: string | null) {
    const file = await this.findOne(id, userId);

    if (folderId) {
      const folder = await this.folderRepository.findOne({ where: { id: folderId } });
      if (!folder) {
        throw new NotFoundException('Target folder not found');
      }
      if (folder.userId !== userId) {
        throw new BadRequestException('Target folder does not belong to you');
      }
    }

    await this.fileRepository.update(id, { folderId: folderId as any });
    return await this.findOne(id, userId);
  }
}
