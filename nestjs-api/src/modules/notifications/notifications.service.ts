import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../entities/notification.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(createDto: any) {
    const notification = this.notificationRepository.create(createDto);
    return await this.notificationRepository.save(notification);
  }

  async findAll(userId: string) {
    // Logic to find notifications for user (recipient = 'all' or specific userId)
    // And exclude ones already read by user? Or just show all.
    // For simplicity showing all targeting the user
    return await this.notificationRepository.createQueryBuilder('notification')
      .leftJoinAndSelect('notification.readBy', 'user')
      .where('notification.recipient = :userId OR notification.recipient = :all', { userId, all: 'all' })
      .orderBy('notification.createdAt', 'DESC')
      .getMany();
  }

  async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['readBy'],
    });

    if (notification) {
      const alreadyRead = notification.readBy.some(u => u.id === userId);
      if (!alreadyRead) {
        // Need to load user entity to add to relation
        // Assuming we have access or just use query builder to insert relation
        // Simplified approach: partial user object might work if TypeORM allows, else need User entity ref
        const user = { id: userId } as User; 
        notification.readBy.push(user);
        await this.notificationRepository.save(notification);
      }
    }
    return { success: true };
  }
}
