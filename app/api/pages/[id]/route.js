import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Page from '../../../../models/Page';
import { authOptions } from '../../auth/[...nextauth]/route';

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = await params;

  try {
    const page = await Page.findById(id);
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const page = await Page.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    
    if (!page) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: page });
  } catch (error) {
      if (error.code === 11000) {
        return NextResponse.json({ success: false, message: 'A page with this slug already exists.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
     return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const deletedPage = await Page.deleteOne({ _id: id });
    if (!deletedPage) {
      return NextResponse.json({ success: false, message: 'Page not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
