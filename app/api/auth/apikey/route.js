import dbConnect from '@/lib/db';
import User from '@/models/User';
import crypto from 'crypto';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../[...nextauth]/route';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    // Generate a random API key
    const apiKey = 'sk_' + crypto.randomBytes(24).toString('hex');

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { apiKey: apiKey },
      { new: true }
    );

    return NextResponse.json({ success: true, apiKey: user.apiKey });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
