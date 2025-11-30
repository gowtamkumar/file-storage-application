import dbConnect from '@/lib/db';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import { NextResponse } from 'next/server';

// GET - Get all available subscription plans
export async function GET() {
  try {
    await dbConnect();

    // Fetch only active plans, sorted by display order
    const plans = await SubscriptionPlan.find({ active: true })
      .sort({ displayOrder: 1, price: 1 })
      .lean();

    // Transform to match the expected format
    const formattedPlans = plans.map(plan => ({
      id: plan.planId,
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      interval: plan.interval,
      description: plan.description,
      features: plan.features,
      limits: plan.limits,
      highlighted: plan.highlighted,
    }));

    return NextResponse.json({ success: true, data: formattedPlans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}
