import { Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@Request() req) {
    const notifications = await this.notificationsService.findAll(req.user.id);
    return { success: true, data: notifications };
  }

  @Post(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return await this.notificationsService.markAsRead(id, req.user.id);
  }
}
