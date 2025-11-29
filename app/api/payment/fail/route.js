import { NextResponse } from 'next/server';

// POST - Handle failed payment
export async function POST(request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    console.log('Payment failed:', data);

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/pricing?payment=failed&reason=${data.status || 'unknown'}`
    );
  } catch (error) {
    console.error('Payment fail handler error:', error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL}/pricing?payment=error`
    );
  }
}
