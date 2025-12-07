import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Page from '../../../models/Page';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(request) {
  await dbConnect();
  
  // Optional: Check permissions if you want to restrict listing to admins only,
  // or allow public listing of published pages via query param.
  const { searchParams } = new URL(request.url);
  const publicOnly = searchParams.get('public') === 'true';

  try {
    let query = {};
    if (publicOnly) {
      query.isPublished = true;
    }

    const pages = await Page.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: pages });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function POST(request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    
    // Basic server-side slug validation/generation could go here
    // but we'll assume the client sends a valid slug or we validate it by model constraints
    
    const page = await Page.create(body);
    return NextResponse.json({ success: true, data: page }, { status: 201 });
  } catch (error) {
    // Check for duplicate key error (slug uniqueness)
    if (error.code === 11000) {
        return NextResponse.json({ success: false, message: 'A page with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
