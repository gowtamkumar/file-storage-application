import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../../entities/subscription-plan.entity';
import { Subscription } from '../../entities/subscription.entity';
import { Transaction } from '../../entities/transaction.entity';
import { User } from '../../entities/user.entity';

@Injectable()
export class PaymentService {
  private stripe: Stripe | null = null;

  constructor(
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
    private configService: ConfigService,
  ) {
    const stripeKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    if (stripeKey) {
      this.stripe = new Stripe(stripeKey, {
        apiVersion: '2024-12-18.acacia' as any,
      });
    } else {
      console.warn(
        'STRIPE_SECRET_KEY is missing. Payment functionality will be disabled.',
      );
    }
  }

  async initPayment(userId: string, planId: string, paymentMethod: string) {
    const plan = await this.planRepository.findOne({
      where: { planId, active: true },
    });

    // Fallback logic for default plans if not in DB can be added here if needed
    // For now assuming plans are in DB as per Next.js logic checking DB first

    if (!plan) {
      throw new NotFoundException(`Invalid plan: ${planId}`);
    }

    if (plan.price === 0) {
      // Handle free plan logic directly? Or return specific status
      return {
        success: true,
        message: 'Free plan, no payment required',
        redirect: false,
      };
    }

    const transactionId = `SUB-${userId}-${Date.now()}`;
    const baseUrl =
      this.configService.get<string>('NEXTAUTH_URL') || 'http://localhost:3000'; // Redirect to Next.js frontend

    if (paymentMethod === 'stripe') {
      const stripe = this.stripe;
      if (!stripe) {
        throw new BadRequestException('Stripe is not configured');
      }
      const session = await stripe.checkout.sessions.create({
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
      throw new BadRequestException(
        'SSLCommerz not fully ported yet for NestJS demo, use Stripe',
      );
    }
  }

  async handleSuccess(sessionId: string, method: string) {
    if (method === 'stripe') {
      const stripe = this.stripe;
      if (!stripe) {
        throw new BadRequestException('Stripe is not configured');
      }
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid') {
          const metadata = session.metadata || {};
          const userId = metadata.userId;
          const planId = metadata.planId;
          const transactionId = metadata.transactionId;

          const amount = session.amount_total ? session.amount_total / 100 : 0;
          const currency = session.currency ? session.currency.toUpperCase() : 'USD';

          // Retrieve plan details
          const plan = await this.planRepository.findOne({ where: { planId } });
          if (!plan) throw new NotFoundException('Plan not found during success handling');

          // Create Subscription
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 1);
          
          let subscription = await this.subscriptionRepository.findOne({ where: { userId, status: 'active' as any } });
          // If existing active subscription, expire it? Next.js logic archived old one.
          if (subscription) {
              subscription.status = 'expired' as any;
              subscription.endDate = new Date();
              await this.subscriptionRepository.save(subscription);
          }

          const newSubscription = this.subscriptionRepository.create({
            userId,
            plan: planId,
            status: 'active' as any,
            startDate: new Date(),
            endDate: endDate,
            storageLimit: plan.limits.storage,
            fileLimit: plan.limits.files,
            planRef: plan.id,
            features: JSON.parse(JSON.stringify(plan.features)) // simplistic map
          });
          const savedSubscription = await this.subscriptionRepository.save(newSubscription);

          // Create Transaction
          const transaction = this.transactionRepository.create({
            userId,
            planId,
            subscriptionId: savedSubscription.id,
            amount: amount,
            currency: currency,
            status: 'success' as any, 
            transactionId: transactionId, 
            paymentMethod: 'stripe',
            // gatewayTransactionId: session.payment_intent as string, // Entity doesn't seem to have this col in snippet I viewed? let's check or skip if not in entity
            metadata: session as any,
          });
          await this.transactionRepository.save(transaction);

          return { success: true, message: 'Payment successful' };
      }
    }
    return { success: false, message: 'Payment verification failed' };
  }
}
