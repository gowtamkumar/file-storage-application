import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Advertisement from '@/models/Advertisement';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
  await dbConnect();

  // Admin check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const ad = await Advertisement.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!ad) {
      return NextResponse.json({ success: false, message: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: ad });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();

    // Admin check
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const deletedAd = await Advertisement.findByIdAndDelete(id);

    if (!deletedAd) {
      return NextResponse.json({ success: false, message: 'Advertisement not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
