import dbConnect from '@/lib/db';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import { NextResponse } from 'next/server';

// GET - Get all available subscription plans
export async function GET() {
  try {
    await dbConnect();

    // Fetch only active plans, sorted by display order
    let plans = await SubscriptionPlan.find({ active: true })
      .sort({ displayOrder: 1, price: 1 })
      .lean();

    // If no plans in database, use default plans from central config
    if (plans.length === 0) {
      plans = DEFAULT_PLANS;
    }

    // Transform to match the expected format
    const formattedPlans = plans.map(plan => ({
      planId: plan.planId,  // Keep as planId for consistency
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
