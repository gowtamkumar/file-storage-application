import dbConnect from '@/lib/db';
import File from '@/models/File';
import { readFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { gunzipSync } from 'zlib';

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

        // Increment download count
        await File.findByIdAndUpdate(file._id, {
            $inc: { downloadCount: 1 },
            lastDownloaded: new Date(),
        });

        // Determine absolute path
        // file.path is like "/uploads/xxx.ext"
        // We need /home/.../public/uploads/xxx.ext
        const filePath = path.join(process.cwd(), 'public', file.path);

        try {
            let fileBuffer = await readFile(filePath);

            // Decompress if file is compressed (backward compatible)
            if (file.isCompressed) {
                try {
                    fileBuffer = gunzipSync(fileBuffer);
                } catch (decompressError) {
                    console.error('Decompression error:', decompressError);
                    return NextResponse.json({ success: false, message: 'Failed to decompress file' }, { status: 500 });
                }
            }

            return new NextResponse(fileBuffer, {
                status: 200,
                headers: {
                    'Content-Type': file.mimetype,
                    'Content-Disposition': `attachment; filename="${file.originalName}"`,
                    'Content-Length': fileBuffer.length.toString(),
                },
            });
        } catch (readError) {
            console.error('File read error:', readError);
            return NextResponse.json({ success: false, message: 'File not found on server' }, { status: 404 });
        }

    } catch (error) {
        console.error('Download tracking error:', error);
        return NextResponse.json({ success: false, message: 'Failed to track download' }, { status: 500 });
    }
}
