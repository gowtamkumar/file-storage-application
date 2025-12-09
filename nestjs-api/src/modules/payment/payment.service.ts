import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(this.configService.get<string>('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2024-12-18.acacia' as any, // Use latest or configured version
    });
  }

  async initPayment(userId: string, planId: string, paymentMethod: string) {
    const plan = await this.planRepository.findOne({ where: { planId, active: true } });
    
    // Fallback logic for default plans if not in DB can be added here if needed
    // For now assuming plans are in DB as per Next.js logic checking DB first

    if (!plan) {
      throw new NotFoundException(`Invalid plan: ${planId}`);
    }

    if (plan.price === 0) {
      // Handle free plan logic directly? Or return specific status
      return { success: true, message: 'Free plan, no payment required', redirect: false };
    }

    const transactionId = `SUB-${userId}-${Date.now()}`;
    const baseUrl = this.configService.get<string>('NEXTAUTH_URL') || 'http://localhost:3000'; // Redirect to Next.js frontend

    if (paymentMethod === 'stripe') {
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: plan.currency.toLowerCase(),
              product_data: {
                name: `${plan.name} Subscription`,
                description: plan.description,
              },
              unit_amount: Math.round(plan.price * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${baseUrl}/api/payment/success?session_id={CHECKOUT_SESSION_ID}&payment_method=stripe`,
        cancel_url: `${baseUrl}/pricing?payment=cancelled`,
        metadata: {
          userId,
          planId,
          transactionId,
          type: 'subscription',
        },
        // customer_email: user.email // If we had user entity loaded
      });

      return {
        success: true,
        gatewayUrl: session.url,
        transactionId,
      };
    } else {
      throw new BadRequestException('SSLCommerz not fully ported yet for NestJS demo, use Stripe');
    }
  }

  async handleSuccess(sessionId: string, method: string) {
    if (method === 'stripe') {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
          const { userId, planId, transactionId } = session.metadata;
          // Retrieve plan details
          const plan = await this.planRepository.findOne({ where: { planId } });
          if (!plan) throw new NotFoundException('Plan not found during success handling');

          // Create Transaction
          const transaction = this.transactionRepository.create({
            userId,
            planId,
            amount: session.amount_total / 100,
            currency: session.currency.toUpperCase(),
            status: 'completed', // Or use enum
            transactionId: transactionId, 
            paymentMethod: 'stripe',
            gatewayTransactionId: session.payment_intent as string,
            metadata: JSON.stringify(session),
          });
          await this.transactionRepository.save(transaction);

          // Update User Subscription
          await this.userRepository.update(userId, {
            subscriptionPlan: planId,
            subscriptionStatus: 'active',
            storageLimit: BigInt(plan.limits.storage) * BigInt(1024 * 1024 * 1024), // GB to Bytes
            subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days, logic for yearly needed
          });

          return { success: true, message: 'Payment successful' };
      }
    }
    return { success: false, message: 'Payment verification failed' };
  }
