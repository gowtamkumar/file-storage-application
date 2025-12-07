import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/db';
import Page from '../../../../../models/Page';

export async function GET(request, { params }) {
  await dbConnect();
  const { slug } = params;

  try {
    const page = await Page.findOne({ slug: slug, isPublished: true });
    
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
