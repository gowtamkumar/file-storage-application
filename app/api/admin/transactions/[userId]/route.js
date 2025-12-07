import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Transaction from '@/models/Transaction';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get transaction history for a specific user (admin only)
export async function GET(request, { params }) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { userId } = params;

    try {
        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: transactions
        });
    } catch (error) {
        console.error('Get user transactions error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
