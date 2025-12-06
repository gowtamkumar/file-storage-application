import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import File from '@/models/File';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

// GET - Get all files across the system (Admin only)
export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Fetch all files with user information
        const files = await File.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        // Map files to include user info
        const filesWithUserInfo = files.map(file => ({
            _id: file._id,
            originalName: file.originalName,
            filename: file.filename,
            path: file.path,
            size: file.size,
            mimetype: file.mimetype,
            isPublic: file.isPublic,
            shareableId: file.shareableId,
            viewCount: file.viewCount || 0,
            downloadCount: file.downloadCount || 0,
            createdAt: file.createdAt,
            user: file.userId?.name || file.userId?.email || 'Unknown',
            userId: file.userId?._id,
        }));

        return NextResponse.json({ success: true, data: filesWithUserInfo });
    } catch (error) {
        console.error('Error fetching files:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
