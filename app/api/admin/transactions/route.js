import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Fetch all transactions (Admin only)
export async function GET(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const query = {};
    if (userId) {
      query.userId = userId;
    }

    const transactions = await Transaction.find(query)
      .populate('userId', 'name email image')
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
