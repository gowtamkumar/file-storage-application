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

    // Return file metadata with download link
    const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    return NextResponse.json({ 
      success: true, 
      data: {
        originalName: file.originalName,
        size: file.size,
        mimetype: file.mimetype,
        createdAt: file.createdAt,
        downloadUrl: `${baseUrl}${file.path}`,
        directUrl: file.path,
      }
    });
  } catch (error) {
    console.error('File access error:', error);
    return NextResponse.json({ success: false, message: 'Failed to retrieve file' }, { status: 500 });
  }
}
