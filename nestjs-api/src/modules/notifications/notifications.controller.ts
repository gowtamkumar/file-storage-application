import { Body, Controller, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
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

  @Put(':id/read')
  async markAsRead(@Request() req, @Param('id') id: string) {
    return await this.notificationsService.markAsRead(id, req.user.id);
  }

  @Post()
  async create(@Request() req, @Body() createDto: any) {
    // Basic admin check (RolesGuard logic is preferred if available globally or in module)
    if (req.user.role !== 'admin') {
       throw new Error('Unauthorized'); // Or use ForbiddenException
    }
    return await this.notificationsService.create(createDto);
  }
}
