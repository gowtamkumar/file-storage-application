import dbConnect from '@/lib/db';
import File from '@/models/File';
import { mkdir, writeFile } from 'fs/promises';
import { customAlphabet } from 'nanoid';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { gzipSync } from 'zlib';
import { z } from 'zod';

// Route segment config for App Router - increase body size limit
export const maxDuration = 60; // 60 seconds max
export const dynamic = 'force-dynamic';

// Generate URL-safe shareable IDs
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);

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

  let data, file;

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
  } catch (fileError) {
    console.error('File extraction error:', fileError);
    return NextResponse.json({
      success: false,
      message: 'Failed to extract file from request.',
      error: fileError.message
    }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
  }

  // Validate file
  const validationResult = FileValidationSchema.safeParse({
    size: file.size,
    type: file.type
  });

  if (!validationResult.success) {
    return NextResponse.json({
      success: false,
      message: validationResult.error.errors[0].message
    }, { status: 400 });
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
        .toBuffer(); // This strips metadata by default
      fileSize = buffer.length;
    } catch (error) {
      console.error('Image processing error:', error);
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

    // Generate shareable ID
    const shareableId = nanoid();

    const newFile = await File.create({
      filename: uniqueFilename,
      originalName: file.name,
      path: `/uploads/${uniqueFilename}`,
      size: fileSize,
      mimetype: file.type,
      userId: null, // No user for public uploads
      folderId: null,
      isPublic: true,
      shareableId: shareableId,
      isCompressed: isCompressed,
    });

    // Generate shareable URL
    const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    const shareableUrl = `${baseUrl}/share/${shareableId}`;

    return NextResponse.json({
      success: true,
      data: {
        file: newFile,
        shareableUrl: shareableUrl,
        shareableId: shareableId,
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
}
