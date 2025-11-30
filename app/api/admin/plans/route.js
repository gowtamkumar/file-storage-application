import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get all subscription plans (including inactive) - Admin only
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const plans = await SubscriptionPlan.find()
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: plans });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription plans' },
      { status: 500 }
    );
  }
}

// POST - Create new subscription plan - Admin only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const {
      planId,
      name,
      price,
      currency,
      interval,
      description,
      features,
      limits,
      highlighted,
      active,
      displayOrder,
    } = body;

    // Validate required fields
    if (!planId || !name || price === undefined || !description) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!limits || limits.storage === undefined || limits.files === undefined) {
      return NextResponse.json(
        { success: false, error: 'Storage and file limits are required' },
        { status: 400 }
      );
    }

    // Check if plan with same planId already exists
    const existingPlan = await SubscriptionPlan.findOne({ planId });
    if (existingPlan) {
      return NextResponse.json(
        { success: false, error: 'Plan with this ID already exists' },
        { status: 409 }
      );
    }

    const newPlan = await SubscriptionPlan.create({
      planId,
      name,
      price,
      currency: currency || 'USD',
      interval: interval || 'month',
      description,
      features: features || [],
      limits,
      highlighted: highlighted || false,
      active: active !== undefined ? active : true,
      displayOrder: displayOrder || 0,
    });

    return NextResponse.json(
      { success: true, data: newPlan },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create subscription plan' },
      { status: 500 }
    );
  }
}
