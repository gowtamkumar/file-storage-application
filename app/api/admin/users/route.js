import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get all users with their statistics (Admin only)
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all users
    const users = await User.find().select('-password').lean();

    // Get file statistics and subscription for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Get files for this user
        const files = await File.find({ userId: user._id });
        const fileCount = files.length;
        const storageUsed = files.reduce((acc, file) => acc + file.size, 0);

        // Get subscription
        const subscription = await Subscription.findOne({ userId: user._id });

        return {
          ...user,
          stats: {
            fileCount,
            storageUsed,
            storageUsedMB: (storageUsed / (1024 * 1024)).toFixed(2),
          },
          subscription: subscription
            ? {
                plan: subscription.plan,
                status: subscription.status,
                storageLimit: subscription.storageLimit,
                fileLimit: subscription.fileLimit,
              }
            : {
                plan: 'free',
                status: 'active',
                storageLimit: 100,
                fileLimit: 50,
              },
        };
      })
    );

    return NextResponse.json({ success: true, data: usersWithStats });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
