import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Fetch single transaction details
export async function GET(request, { params }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = params;
    const transaction = await Transaction.findById(id).populate('userId', 'name email image');

    if (!transaction) {
        return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    console.error('Error fetching transaction details:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
