import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Folder } from '../../entities/folder.entity';

@Injectable()
export class FoldersService {
  constructor(
    @InjectRepository(Folder)
    private folderRepository: Repository<Folder>,
  ) {}

  async create(userId: string, createFolderDto: any) {
    const { name, parentId } = createFolderDto;

    // Check for duplicate folder definition
    const existingFolder = await this.folderRepository.findOne({
      where: {
        name: name,
        userId: userId,
        parentId: parentId || null,
      },
    });

    if (existingFolder) {
      throw new ConflictException('Folder with this name already exists');
    }

    const folder = this.folderRepository.create({
      name,
      userId,
      parentId: parentId || null,
    });

    return await this.folderRepository.save(folder);
  }

  async findAll(userId: string) {
    return await this.folderRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string) {
    const folder = await this.folderRepository.findOne({ where: { id, userId } });
    if (!folder) {
      throw new NotFoundException('Folder not found');
    }
    return folder;
  }

  async update(id: string, userId: string, updateData: Partial<Folder>) {
    await this.findOne(id, userId);
    await this.folderRepository.update(id, updateData);
    return await this.findOne(id, userId);
  }

  async delete(id: string, userId: string) {
    const folder = await this.findOne(id, userId);
    // Note: Recursive delete logic usually needed here for real apps
    // Cascading delete might handle it if configured in DB, otherwise manual cleanup needed
    return await this.folderRepository.remove(folder);
  }
}
