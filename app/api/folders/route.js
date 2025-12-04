import dbConnect from '@/lib/db';
import Folder from '@/models/Folder';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    let query = {};
    if (session.user.role !== 'admin') {
      query = { userId: session.user.id };
    }

    const folders = await Folder.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: folders });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, parentId } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json({ success: false, message: 'Folder name is required' }, { status: 400 });
    }

    // Check for duplicate folder name in the same parent
    const existingFolder = await Folder.findOne({
      name: name.trim(),
      userId: session.user.id,
      parentId: parentId || null,
    });

    if (existingFolder) {
      return NextResponse.json({ success: false, message: 'Folder with this name already exists' }, { status: 400 });
    }

    const folder = await Folder.create({
      name: name.trim(),
      userId: session.user.id,
      parentId: parentId || null,
    });

    return NextResponse.json({ success: true, data: folder }, { status: 201 });
  } catch (error) {
    console.error('Create folder error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
