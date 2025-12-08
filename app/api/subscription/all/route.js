import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Subscription from '@/models/Subscription';
import Transaction from '@/models/Transaction';
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

    const subscriptionsWithPayment = await Promise.all(subscriptions.map(async (sub) => {
      const transaction = await Transaction.findOne({
        subscriptionId: sub._id,
        status: 'success'
      }).sort({ createdAt: -1 });

      return {
        ...sub.toObject(),
        paymentInfo: transaction ? {
          amount: transaction.amount,
          currency: transaction.currency,
          transactionId: transaction.transactionId,
          paymentMethod: transaction.paymentMethod,
          lastPaymentDate: transaction.createdAt
        } : null
      };
    }));

    // Calculate total revenue from transactions
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Calculate statistics
    const stats = {
      total: await Transaction.countDocuments({ status: 'success' }),
      active: subscriptions.filter(s => s.status === 'active').length,
      free: subscriptions.filter(s => s.plan === 'free').length,
      basic: subscriptions.filter(s => s.plan === 'basic').length,
      pro: subscriptions.filter(s => s.plan === 'pro').length,
      enterprise: subscriptions.filter(s => s.plan === 'enterprise').length,
      totalRevenue: totalRevenue[0]?.total || 0,
    };

    return NextResponse.json({
      success: true,
      data: subscriptionsWithPayment,
      stats
    });
  } catch (error) {
    console.error('Get all subscriptions error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
