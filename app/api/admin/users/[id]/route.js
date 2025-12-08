import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import Subscription from '@/models/Subscription';
import Transaction from '@/models/Transaction';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Fetch full user details (Admin only)
export async function GET(request, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    // 1. Fetch ALL subscriptions (history)
    const subscriptions = await Subscription.find({ userId: id })
      .sort({ createdAt: -1 });

    // 2. Fetch ALL transactions
    const transactions = await Transaction.find({ userId: id })
      .sort({ createdAt: -1 });

    // 2.5 Attach amount to subscriptions from transactions
    const subscriptionsWithAmount = subscriptions.map(sub => {
      const transaction = transactions.find(t =>
        t.subscriptionId?.toString() === sub._id.toString() && t.status === 'success'
      );
      return {
        ...sub.toObject(),
        amount: transaction ? transaction.amount : 0,
        currency: transaction ? transaction.currency : 'USD'
      };
    });

    // 3. Fetch File Statistics
    const files = await File.find({ userId: id });
    const fileCount = files.length;
    const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

    // 4. Calculate total spent
    const totalSpent = transactions
      .filter(t => t.status === 'success')
      .reduce((acc, t) => acc + t.amount, 0);

    return NextResponse.json({
      success: true,
      data: {
        user,
        subscriptions: subscriptionsWithAmount,
        transactions,
        stats: {
          fileCount,
          totalStorage,
          totalStorageMB: (totalStorage / (1024 * 1024)).toFixed(2),
          totalSpent
        }
      },
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
