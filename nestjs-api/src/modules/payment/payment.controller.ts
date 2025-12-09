import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('init')
  async initPayment(@Request() req, @Body() body: any) {
    const { plan: planId, paymentMethod } = body;
    return await this.paymentService.initPayment(
      req.user.id,
      planId,
      paymentMethod,
    );
  }

  @Get('success')
  async handleSuccess(
    @Query('session_id') sessionId: string,
    @Query('payment_method') method: string,
    @Res() res,
  ) {
    const result = await this.paymentService.handleSuccess(sessionId, method);
    if (result.success) {
      return res.redirect(
        `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/dashboard?payment=success`,
      );
    }
    return res.redirect(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/pricing?payment=failed`,
    );
  }
}
