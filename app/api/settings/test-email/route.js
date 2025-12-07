
import { authOptions } from '@/lib/auth';
import { sendEmail } from '@/lib/email';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { to } = await request.json();
    
    if (!to) {
      return NextResponse.json({ success: false, message: 'Recipient email is required' }, { status: 400 });
    }

    const result = await sendEmail({
      to,
      subject: 'Test Email from FileStore',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #3b82f6;">Test Email</h2>
          <p>This is a test email to verify your SMTP configuration.</p>
          <p>If you received this, your email settings are working correctly!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #888;">Sent from FileStore System</p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Test email sent successfully' });
    } else {
      return NextResponse.json({ success: false, message: result.error || 'Failed to send email' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
