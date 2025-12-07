
import dbConnect from '@/lib/db';
import SiteSettings from '@/models/SiteSettings';
import nodemailer from 'nodemailer';

export async function sendEmail({ to, subject, html, text }) {
  await dbConnect();
  const settings = await SiteSettings.getSettings();
  const { smtp } = settings;

  if (!smtp || !smtp.host || !smtp.user || !smtp.password) {
    console.warn('SMTP settings not configured. Email not sent.');
    return { success: false, message: 'SMTP settings not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.secure, // true for 465, false for other ports
    auth: {
      user: smtp.user,
      pass: smtp.password,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"${smtp.fromName}" <${smtp.fromEmail || smtp.user}>`, // sender address
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''), // fallback plain text
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}
