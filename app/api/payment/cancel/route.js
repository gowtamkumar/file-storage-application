import { NextResponse } from 'next/server';

// POST - Handle cancelled payment
export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    console.log('Payment cancelled:', data);

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/pricing?payment=cancelled`
    );
  } catch (error) {
    console.error('Payment cancel handler error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/pricing?payment=error`
    );
  }
}
