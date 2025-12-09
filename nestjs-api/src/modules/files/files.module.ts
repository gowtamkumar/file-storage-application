import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from '../../entities/file.entity';
import { Folder } from '../../entities/folder.entity';
import { User } from '../../entities/user.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [TypeOrmModule.forFeature([File, Folder, User])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
