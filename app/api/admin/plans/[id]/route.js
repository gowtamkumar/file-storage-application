import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import SubscriptionPlan from '@/models/SubscriptionPlan';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get specific subscription plan - Admin only
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const plan = await SubscriptionPlan.findById(id);

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error('Error fetching subscription plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription plan' },
      { status: 500 }
    );
  }
}

// PUT - Update subscription plan - Admin only
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    const body = await request.json();

    // Don't allow changing planId if it creates a duplicate
    if (body.planId) {
      const existingPlan = await SubscriptionPlan.findOne({ 
        planId: body.planId,
        _id: { $ne: id }
      });
      
      if (existingPlan) {
        return NextResponse.json(
          { success: false, error: 'Plan with this ID already exists' },
          { status: 409 }
        );
      }
    }

    const updatedPlan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );

    if (!updatedPlan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedPlan });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete subscription plan (set active: false) - Admin only
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { id } = await params;
    
    // Soft delete by setting active to false
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      id,
      { $set: { active: false } },
      { new: true }
    );

    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Plan not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Plan deactivated successfully',
      data: plan 
    });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete subscription plan' },
      { status: 500 }
    );
  }
}
