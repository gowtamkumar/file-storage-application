import dbConnect from '@/lib/db';
import File from '@/models/File';
import Folder from '@/models/Folder';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../../auth/[...nextauth]/route';

export async function PUT(request, context) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { folderId } = body;

    const file = await File.findById(id);

    if (!file) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    // Check ownership
    if (session.user.role !== 'admin' && file.userId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Validate target folder if provided
    if (folderId) {
      const folder = await Folder.findById(folderId);
      
      if (!folder) {
        return NextResponse.json({ success: false, message: 'Target folder not found' }, { status: 404 });
      }
      
      // Check folder ownership
      if (session.user.role !== 'admin' && folder.userId.toString() !== session.user.id) {
        return NextResponse.json({ success: false, message: 'Target folder does not belong to you' }, { status: 403 });
      }
    }

    file.folderId = folderId || null;
    await file.save();

    return NextResponse.json({ success: true, data: file });
  } catch (error) {
    console.error('Move file error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
