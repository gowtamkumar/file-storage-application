import dbConnect from '@/lib/db';
import File from '@/models/File';
import User from '@/models/User';
import { mkdir, writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { gzipSync } from 'zlib';
import { z } from 'zod';
import { authOptions } from '../auth/[...nextauth]/route';

// Route segment config for App Router - increase body size limit
export const maxDuration = 60; // 60 seconds max
export const dynamic = 'force-dynamic';

const MAX_FILE_SIZE = (Number(process.env.MAX_FILE_SIZE) || 64) * 1024 * 1024; // Default 64MB
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

  let data, file, folderId;

  // Add error handling for FormData parsing
  try {
    data = await request.formData();
  } catch (formDataError) {
    console.error('FormData parse error:', formDataError);
    return NextResponse.json({
      success: false,
      message: 'Invalid request format. Please ensure you are sending multipart/form-data.',
      error: formDataError.message
    }, { status: 400 });
  }

  try {
    file = data.get('file');
    folderId = data.get('folderId');
  } catch (extractError) {
    console.error('Data extraction error:', extractError);
    return NextResponse.json({
      success: false,
      message: 'Failed to extract data from request.',
      error: extractError.message
    }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  // Validate folder if provided
  if (folderId) {
    const Folder = (await import('@/models/Folder')).default;
    const folder = await Folder.findById(folderId);

    if (!folder) {
      return NextResponse.json({ success: false, message: 'Folder not found' }, { status: 404 });
    }

    // Check folder ownership
    if (folder.userId.toString() !== userId) {
      return NextResponse.json({ success: false, message: 'Folder does not belong to you' }, { status: 403 });
    }
  }


  // Validate file
  const validationResult = FileValidationSchema.safeParse({
    size: file.size,
    type: file.type
  });

  if (!validationResult.success) {
    return NextResponse.json({ success: false, message: validationResult.error.message }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  let buffer = Buffer.from(bytes);
  let fileSize = file.size;
  let isCompressed = false;

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

  // Text File Compression (60-90% size reduction)
  if (file.type === 'text/plain') {
    try {
      buffer = gzipSync(buffer);
      fileSize = buffer.length;
      isCompressed = true;
    } catch (error) {
      console.error('Text compression error:', error);
      // Continue without compression if it fails
      isCompressed = false;
    }
  }

  // PDF Compression (30-50% size reduction)
  if (file.type === 'application/pdf') {
    try {
      buffer = gzipSync(buffer);
      fileSize = buffer.length;
      isCompressed = true;
    } catch (error) {
      console.error('PDF compression error:', error);
      // Continue without compression if it fails
      isCompressed = false;
    }
  }

  // Create unique filename
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const filename = file.name.replace(/\s+/g, '-');
  let uniqueFilename = `${uniqueSuffix}-${filename}`;

  // Append .gz extension for compressed files
  if (isCompressed) {
    uniqueFilename += '.gz';
  }

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
      folderId: folderId || null,
      isCompressed: isCompressed,
    });

    return NextResponse.json({ success: true, data: newFile });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
