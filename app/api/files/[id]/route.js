import dbConnect from '@/lib/db';
import File from '@/models/File';
import { unlink } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import path from 'path';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;
  const session = await getServerSession(authOptions);
  

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const file = await File.findById(id);
    if (!file) {
      return NextResponse.json({ success: false, message: 'File not found' }, { status: 404 });
    }

    // Check ownership
    if (session.user.role !== 'admin' && file.userId?.toString() !== session.user.id) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    // The file.path is like "/uploads/filename.ext", so we need to join with 'public'
    const filePath = path.join(process.cwd(), 'public', file.path);
    
    console.log('Attempting to delete file:', filePath);
    
    try {
      await unlink(filePath);
      console.log('File deleted from disk successfully');
    } catch (err) {
      console.error('Error deleting file from disk:', err);
      // Continue with database deletion even if file doesn't exist on disk
    }

    await File.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'File deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
