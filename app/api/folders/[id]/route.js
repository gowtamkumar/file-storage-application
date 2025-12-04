import dbConnect from '@/lib/db';
import File from '@/models/File';
import Folder from '@/models/Folder';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function PUT(request, context) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const body = await request.json();
    const { name } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Folder name is required' }, { status: 400 });
    }

    const folder = await Folder.findById(id);

    if (!folder) {
      return NextResponse.json({ success: false, message: 'Folder not found' }, { status: 404 });
    }

    // Check ownership (non-admin users can only edit their own folders)
    if (session.user.role !== 'admin' && folder.userId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Check for duplicate name
    const existingFolder = await Folder.findOne({
      name: name.trim(),
      userId: folder.userId,
      parentId: folder.parentId,
      _id: { $ne: id },
    });

    if (existingFolder) {
      return NextResponse.json({ success: false, message: 'Folder with this name already exists' }, { status: 400 });
    }

    folder.name = name.trim();
    await folder.save();

    return NextResponse.json({ success: true, data: folder });
  } catch (error) {
    console.error('Update folder error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await context.params;
    const folder = await Folder.findById(id);

    if (!folder) {
      return NextResponse.json({ success: false, message: 'Folder not found' }, { status: 404 });
    }

    // Check ownership
    if (session.user.role !== 'admin' && folder.userId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    // Move all files in this folder to root (set folderId to null)
    await File.updateMany(
      { folderId: id },
      { $set: { folderId: null } }
    );

    // Delete the folder
    await Folder.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Folder deleted and files moved to root' });
  } catch (error) {
    console.error('Delete folder error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
