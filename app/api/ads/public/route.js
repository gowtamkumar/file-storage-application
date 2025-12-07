import dbConnect from '@/lib/db';
import Advertisement from '@/models/Advertisement';
import { NextResponse } from 'next/server';

export async function GET(request) {
  await dbConnect();

  // Get placement query param if needed
  const { searchParams } = new URL(request.url);
  const placement = searchParams.get('placement');

  try {
    const query = { isActive: true };
    if (placement) {
        // If placement specified, find ads for that placement OR 'everywhere'
        query.$or = [{ placement: placement }, { placement: 'everywhere' }];
    }

    const ads = await Advertisement.find(query);
    
    // Simple rotation logic: Pick one random ad
    // In a real app, you might return all matching ads and let frontend rotate, or use weighted random.
    if (ads.length === 0) {
        return NextResponse.json({ success: true, data: null });
    }

    const randomAd = ads[Math.floor(Math.random() * ads.length)];

    return NextResponse.json({ success: true, data: randomAd });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
