import dbConnect from '@/lib/db';
import File from '@/models/File';
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

    const files = await File.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: files });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
