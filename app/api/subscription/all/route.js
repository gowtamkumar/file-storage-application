import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get all subscriptions (admin only)
export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscriptions = await Subscription.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    // Calculate statistics
    const stats = {
      total: subscriptions.length,
      active: subscriptions.filter(s => s.status === 'active').length,
      free: subscriptions.filter(s => s.plan === 'free').length,
      basic: subscriptions.filter(s => s.plan === 'basic').length,
      pro: subscriptions.filter(s => s.plan === 'pro').length,
      enterprise: subscriptions.filter(s => s.plan === 'enterprise').length,
      totalRevenue: subscriptions.reduce((acc, s) => {
        if (s.paymentInfo?.amount) return acc + s.paymentInfo.amount;
        return acc;
      }, 0),
    };

    return NextResponse.json({ 
      success: true, 
      data: subscriptions,
      stats 
    });
  } catch (error) {
    console.error('Get all subscriptions error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
