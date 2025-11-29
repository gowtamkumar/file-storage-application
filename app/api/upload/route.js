import dbConnect from '@/lib/db';
import File from '@/models/File';
import User from '@/models/User';
import { mkdir, writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import path from 'path';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(request) {
  await dbConnect();

  // Check for API Key
  const apiKey = request.headers.get('x-api-key');
  let userId = null;

  if (apiKey) {
    const user = await User.findOne({ apiKey });
    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid API Key' }, { status: 401 });
    }
    userId = user._id;
  } else {
    // Check for Session
    const session = await getServerSession(authOptions);
    if (session) {
      userId = session.user.id;
    }
  }

  if (!userId) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get('file');

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.name.replace(/\s+/g, '-');
  const uniqueFilename = `${uniqueSuffix}-${filename}`;
  
  const uploadDir = path.join(process.cwd(), 'public/uploads');
  
  try {
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, uniqueFilename), buffer);

    const newFile = await File.create({
      filename: uniqueFilename,
      originalName: file.name,
      path: `/uploads/${uniqueFilename}`,
      size: file.size,
      mimetype: file.type,
      userId: userId,
    });

    return NextResponse.json({ success: true, data: newFile });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
