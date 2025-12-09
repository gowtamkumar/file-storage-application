import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    // In a real app we'd use a LocalGuard/Strategy to pre-validate credentials
    // Here we'll do it manually for simplicity to match the service flow or implementing LocalStrategy later
    const user = await this.authService.validateUser(req.email, req.password);
    if (!user) {
        return { success: false, message: 'Invalid credentials' };
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() registerDto: any) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
