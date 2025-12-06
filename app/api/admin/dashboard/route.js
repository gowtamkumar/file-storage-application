import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import Folder from '@/models/Folder';
import Subscription from '@/models/Subscription';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get dashboard statistics (Admin only)
export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalFiles = await File.countDocuments();
    const totalFolders = await Folder.countDocuments();
    const totalSubscriptions = await Subscription.countDocuments();

    // Get storage statistics
    const files = await File.find();
    const totalStorage = files.reduce((acc, file) => acc + file.size, 0);

    // Get subscription breakdown
    const subscriptions = await Subscription.find();
    const subscriptionBreakdown = {
      free: subscriptions.filter(s => s.plan === 'free').length,
      basic: subscriptions.filter(s => s.plan === 'basic').length,
      pro: subscriptions.filter(s => s.plan === 'pro').length,
      enterprise: subscriptions.filter(s => s.plan === 'enterprise').length,
    };

    // Get recent files
    const recentFiles = await File.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email');

    // Get user growth (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsers = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    // Get analytics for public files
    const publicFiles = await File.find({ isPublic: true });
    const totalViews = publicFiles.reduce((acc, file) => acc + (file.viewCount || 0), 0);
    const totalDownloads = publicFiles.reduce((acc, file) => acc + (file.downloadCount || 0), 0);

    // Get trending files (most viewed and most downloaded)
    const mostViewed = await File.find({ isPublic: true })
      .sort({ viewCount: -1 })
      .limit(10)
      .select('originalName viewCount downloadCount createdAt shareableId');

    const mostDownloaded = await File.find({ isPublic: true })
      .sort({ downloadCount: -1 })
      .limit(10)
      .select('originalName viewCount downloadCount createdAt shareableId');

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          totalFiles,
          totalFolders,
          totalSubscriptions,
          totalStorage,
          totalStorageMB: (totalStorage / (1024 * 1024)).toFixed(2),
          newUsersWeek: newUsers,
          totalViews,
          totalDownloads,
          publicFiles: publicFiles.length,
        },
        subscriptionBreakdown,
        recentFiles: recentFiles.map(file => ({
          name: file.originalName,
          size: file.size,
          user: file.userId?.name || file.userId?.email || 'Unknown',
          createdAt: file.createdAt,
          viewCount: file.viewCount || 0,
          downloadCount: file.downloadCount || 0,
          isPublic: file.isPublic || false,
        })),
        trending: {
          mostViewed: mostViewed.map(file => ({
            _id: file._id,
            name: file.originalName,
            viewCount: file.viewCount || 0,
            downloadCount: file.downloadCount || 0,
            createdAt: file.createdAt,
            shareableId: file.shareableId,
          })),
          mostDownloaded: mostDownloaded.map(file => ({
            _id: file._id,
            name: file.originalName,
            viewCount: file.viewCount || 0,
            downloadCount: file.downloadCount || 0,
            createdAt: file.createdAt,
            shareableId: file.shareableId,
          })),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
