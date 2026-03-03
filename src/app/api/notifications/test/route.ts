import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDocument } from '@/lib/firebase';
import type { EmailSettings } from '@/types';

export async function POST() {
  try {
    const emailDoc = await getDocument('settings', 'email') as EmailSettings | null;

    if (!emailDoc?.smtp?.host || !emailDoc?.smtp?.user || !emailDoc?.smtp?.pass) {
      return NextResponse.json(
        { sent: false, error: 'SMTP settings not configured. Please fill in host, username, and password first and save.' },
        { status: 400 }
      );
    }

    const adminEmail = emailDoc.notifications?.adminEmail;
    if (!adminEmail) {
      return NextResponse.json(
        { sent: false, error: 'No admin notification email set. Please enter one and save.' },
        { status: 400 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: emailDoc.smtp.host,
      port: emailDoc.smtp.port || 587,
      secure: emailDoc.smtp.secure || false,
      auth: {
        user: emailDoc.smtp.user,
        pass: emailDoc.smtp.pass,
      },
    });

    const fromName = emailDoc.smtp.fromName || 'Unlimited IT Solutions';
    const fromEmail = emailDoc.smtp.fromEmail || emailDoc.smtp.user;

    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: adminEmail,
      subject: '✅ Test Email — Unlimited IT Solutions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 22px;">✅ Email Working!</h1>
          </div>
          <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
            <p style="color: #374151; font-size: 16px; margin: 0 0 12px;">
              Your SMTP email settings are configured correctly.
            </p>
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 16px;">
              Notifications for new signups, orders, and payments will be sent to this email address.
            </p>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 6px 12px; color: #6b7280;">SMTP Host</td>
                <td style="padding: 6px 12px; color: #111827; font-weight: 600;">${emailDoc.smtp.host}</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 6px 12px; color: #6b7280;">Port</td>
                <td style="padding: 6px 12px; color: #111827;">${emailDoc.smtp.port}${emailDoc.smtp.secure ? ' (SSL)' : ' (TLS)'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 12px; color: #6b7280;">From</td>
                <td style="padding: 6px 12px; color: #111827;">${fromName} &lt;${fromEmail}&gt;</td>
              </tr>
              <tr style="background: white;">
                <td style="padding: 6px 12px; color: #6b7280;">Sent At</td>
                <td style="padding: 6px 12px; color: #111827;">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
              </tr>
            </table>
            <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb; text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                This is a test email from your Unlimited IT Solutions admin panel.
              </p>
            </div>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('Test email error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { sent: false, error: `Failed to send: ${msg}` },
      { status: 500 }
    );
  }
}
