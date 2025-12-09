import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Transaction } from '../../entities/transaction.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async getUserSubscription(userId: string) {
    let subscription = await this.subscriptionRepository.findOne({
      where: { userId, status: 'active' as any}, // Using any to bypass enum check issue if strict
      relations: ['subscriptionPlan'],
    });

    if (!subscription) {
      // Create free plan
      const now = new Date();
      subscription = this.subscriptionRepository.create({
        userId,
        plan: 'free',
        storageLimit: 100,
        fileLimit: 50,
        features: {
          apiAccess: false,
          customBranding: false,
          prioritySupport: false,
          analytics: false,
        },
        startDate: now,
        status: 'active' as any,
      });
      await this.subscriptionRepository.save(subscription);
    }

    const transactions = await this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return {
      ...subscription,
      transactions,
    };
  }

  async getPlans() {
    return await this.planRepository.find({
      where: { active: true },
      order: { displayOrder: 'ASC' },
    });
  }

  async subscribe(userId: string, planId: string, paymentInfo: any) {
    const plan = await this.planRepository.findOne({ where: { planId, active: true } });
    if (!plan) {
      throw new BadRequestException('Invalid plan');
    }

    const endDate = new Date();
    // Simple logic for next month, improve for edge cases
    endDate.setMonth(endDate.getMonth() + 1);

    let subscription = await this.subscriptionRepository.findOne({ where: { userId } });
    
    if (!subscription) {
       subscription = this.subscriptionRepository.create({ userId });
    }

    subscription.plan = planId;
    subscription.planRef = plan.id;
    subscription.status = 'active' as any;
    subscription.startDate = new Date();
    subscription.endDate = endDate;
    subscription.storageLimit = plan.limits.storage;
    subscription.fileLimit = plan.limits.files;
    // Map features array to object if needed or just store plain array? 
    // Mongoose schema had features as object: { apiAccess: boolean, ... }
    // Plan entity has features as string[]
    // We need to map string[] features to the object structure expected by Frontend or maintain consistency
    // For now assuming direct mapping or we'll adapt. The entity Subscription has features as JSONB.
    // Let's create a map based on plan features
    const featureMap = {};
    if (plan.features) {
        plan.features.forEach(f => {
            featureMap[f] = true;
        });
    }
    subscription.features = featureMap;

    return await this.subscriptionRepository.save(subscription);
  }
}
