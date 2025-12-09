import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Transaction } from '../../entities/transaction.entity';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, SubscriptionPlan, Transaction])],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
