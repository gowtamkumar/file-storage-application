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
              features: subscription.features,
            }
            : {
              plan: 'free',
              status: 'active',
              storageLimit: 100,
              fileLimit: 50,
              features: {
                apiAccess: false,
                customBranding: false,
                prioritySupport: false,
                analytics: false,
              },
            },
        };
      })
    );

    // Calculate subscription statistics
    const subscriptionStats = usersWithStats.reduce((acc, user) => {
      const plan = user.subscription?.plan || 'free';
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: usersWithStats,
      stats: {
        subscriptionCounts: subscriptionStats,
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        inactiveUsers: users.filter(u => u.status === 'inactive').length,
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH - Update user status (Admin only)
export async function PATCH(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { userId, status } = await request.json();

    if (!userId || !status) {
      return NextResponse.json({ success: false, message: 'User ID and status are required' }, { status: 400 });
    }

    if (!['active', 'inactive'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status. Must be "active" or "inactive"' }, { status: 400 });
    }

    // Prevent admin from deactivating themselves
    if (userId === session.user.id) {
      return NextResponse.json({ success: false, message: 'You cannot deactivate your own account' }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
