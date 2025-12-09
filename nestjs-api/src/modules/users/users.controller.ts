import { Body, Controller, Get, Patch, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProfile(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    // Remove password from response
    const { password, ...result } = user;
    return { success: true, data: result };
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async updateProfile(@Request() req, @Body() updateData: any) {
    // Logic to handle password update specifically (hashing) should probably be in service or here
    // For now delegating simple updates
    const updatedUser = await this.usersService.update(req.user.id, updateData);
    const { password, ...result } = updatedUser;
    return { success: true, message: 'Profile updated successfully', data: result };
  }
}
