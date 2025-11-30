import dbConnect from '@/lib/db';
import File from '@/models/File';
import User from '@/models/User';
import { mkdir, writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'image/gif', 
  'application/pdf', 
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const FileValidationSchema = z.object({
  size: z.number().max(MAX_FILE_SIZE, "File size must be less than " + MAX_FILE_SIZE + "MB"),
  type: z.string().refine((val) => ALLOWED_FILE_TYPES.includes(val), "File type not allowed"),
});

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

  // Validate file
  const validationResult = FileValidationSchema.safeParse({
    size: file.size,
    type: file.type
  });

  if (!validationResult.success) {
    return NextResponse.json({ success: false, message: validationResult.error.errors[0].message }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);
  let fileSize = file.size;

  // Image Optimization & Security (Strip Metadata)
  if (file.type.startsWith('image/')) {
    try {
      buffer = await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF before stripping
        .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true }) // Resize to max 1920x1920
        .toBuffer(); // This strips metadata by default unless .withMetadata() is called
      fileSize = buffer.length;
    } catch (error) {
      console.error('Image processing error:', error);
      // If image processing fails, we might want to reject the upload or fallback.
      // For security, if it claims to be an image but fails processing, it might be malicious.
      return NextResponse.json({ success: false, message: 'Invalid image file' }, { status: 400 });
    }
  }

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
      size: fileSize,
      mimetype: file.type,
      userId: userId,
    });

    return NextResponse.json({ success: true, data: newFile });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
