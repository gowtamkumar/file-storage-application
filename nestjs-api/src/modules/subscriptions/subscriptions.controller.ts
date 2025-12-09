import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscription')
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSubscription(@Request() req) {
    const data = await this.subscriptionsService.getUserSubscription(req.user.id);
    return { success: true, data };
  }

  // Public endpoint for plans
  @Get('plans')
  async getPlans() {
    const plans = await this.subscriptionsService.getPlans();
    return { success: true, data: plans };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async subscribe(@Request() req, @Body() body: any) {
    const { plan, paymentInfo } = body;
    const subscription = await this.subscriptionsService.subscribe(req.user.id, plan, paymentInfo);
    return { success: true, message: `Successfully subscribed to ${plan} plan`, data: subscription };
  }
}
