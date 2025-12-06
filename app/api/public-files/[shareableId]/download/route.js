import dbConnect from '@/lib/db';
import File from '@/models/File';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    await dbConnect();

    const { shareableId } = await params;

    if (!shareableId) {
        return NextResponse.json({ success: false, message: 'Shareable ID is required' }, { status: 400 });
    }

    try {
        const file = await File.findOne({ shareableId, isPublic: true });

        if (!file) {
            return NextResponse.json({ success: false, message: 'File not found or not public' }, { status: 404 });
        }

        // Increment download count
        await File.findByIdAndUpdate(file._id, {
            $inc: { downloadCount: 1 },
            lastDownloaded: new Date(),
        });

        // Return the file path for download
        const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;

        return NextResponse.json({
            success: true,
            data: {
                downloadUrl: `${baseUrl}${file.path}`,
                filename: file.originalName,
            }
        });
    } catch (error) {
        console.error('Download tracking error:', error);
        return NextResponse.json({ success: false, message: 'Failed to track download' }, { status: 500 });
    }
}
