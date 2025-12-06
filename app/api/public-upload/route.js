import dbConnect from '@/lib/db';
import File from '@/models/File';
import { mkdir, writeFile } from 'fs/promises';
import { customAlphabet } from 'nanoid';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';
import { z } from 'zod';

// Generate URL-safe shareable IDs
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 12);

const MAX_FILE_SIZE = (Number(process.env.MAX_FILE_SIZE) || 5) * 1024 * 1024; // Default 5MB
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
    return NextResponse.json({ 
      success: false, 
      message: validationResult.error.errors[0].message 
    }, { status: 400 });
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
        .toBuffer(); // This strips metadata by default
      fileSize = buffer.length;
    } catch (error) {
      console.error('Image processing error:', error);
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
    });

    // Generate shareable URL
    const baseUrl = process.env.NEXTAUTH_URL || `http://localhost:${process.env.PORT || 3000}`;
    const shareableUrl = `${baseUrl}/api/public-files/${shareableId}`;

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
