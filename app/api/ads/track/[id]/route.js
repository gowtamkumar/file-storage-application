import dbConnect from '@/lib/db';
import Advertisement from '@/models/Advertisement';
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
  await dbConnect();
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { type } = body; // 'view' or 'click'

    if (!['view', 'click'].includes(type)) {
         return NextResponse.json({ success: false, message: 'Invalid tracking type' }, { status: 400 });
    }

    const update = type === 'view' ? { $inc: { views: 1 } } : { $inc: { clicks: 1 } };

    await Advertisement.findByIdAndUpdate(id, update);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
