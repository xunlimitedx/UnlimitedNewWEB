import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { getDocument } from '@/lib/firebase';
import type { EmailSettings } from '@/types';

async function getSmtpConfig() {
  // Try Firestore settings first, fall back to env vars
  const emailDoc = await getDocument('settings', 'email') as EmailSettings | null;

  if (emailDoc?.smtp?.host && emailDoc?.smtp?.user && emailDoc?.smtp?.pass) {
    return {
      host: emailDoc.smtp.host,
      port: emailDoc.smtp.port || 587,
      secure: emailDoc.smtp.secure || false,
      user: emailDoc.smtp.user,
      pass: emailDoc.smtp.pass,
      fromEmail: emailDoc.smtp.fromEmail || emailDoc.smtp.user,
      fromName: emailDoc.smtp.fromName || 'Unlimited IT Solutions',
      adminEmail: emailDoc.notifications?.adminEmail || process.env.ADMIN_NOTIFICATION_EMAIL || '',
      notifications: emailDoc.notifications || {
        onNewSignup: true,
        onNewOrder: true,
        onPaymentReceived: true,
        onContactForm: true,
        adminEmail: '',
      },
    };
  }

  // Fallback to env vars
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpHost || !smtpUser || !smtpPass) return null;

  return {
    host: smtpHost,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: (process.env.SMTP_PORT || '587') === '465',
    user: smtpUser,
    pass: smtpPass,
    fromEmail: process.env.SMTP_FROM || smtpUser,
    fromName: 'Unlimited IT Solutions',
    adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || 'willemvangreunen6@gmail.com',
    notifications: {
      onNewSignup: true,
      onNewOrder: true,
      onPaymentReceived: true,
      onContactForm: true,
      adminEmail: process.env.ADMIN_NOTIFICATION_EMAIL || '',
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json({ error: 'Missing type or data' }, { status: 400 });
    }

    const config = await getSmtpConfig();
    if (!config) {
      console.warn('SMTP not configured — skipping email notification');
      return NextResponse.json({ sent: false, reason: 'SMTP not configured' });
    }

    // Check notification preferences
    if (type === 'new-signup' && !config.notifications.onNewSignup) {
      return NextResponse.json({ sent: false, reason: 'Notification disabled' });
    }
    if (type === 'new-order' && !config.notifications.onNewOrder) {
      return NextResponse.json({ sent: false, reason: 'Notification disabled' });
    }
    if (type === 'payment-received' && !config.notifications.onPaymentReceived) {
      return NextResponse.json({ sent: false, reason: 'Notification disabled' });
    }
    if (type === 'contact-form' && !config.notifications.onContactForm) {
      return NextResponse.json({ sent: false, reason: 'Notification disabled' });
    }

    if (!config.adminEmail) {
      return NextResponse.json({ sent: false, reason: 'No admin email configured' });
    }

    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });

    let subject = '';
    let html = '';

    switch (type) {
      case 'new-signup': {
        subject = `🆕 New User Registered — ${data.displayName || data.email}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New User Registration</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; margin: 0 0 16px;">A new user has signed up on <strong>Unlimited IT Solutions</strong>:</p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Name</td>
                  <td style="padding: 8px 12px; color: #111827; font-weight: 600;">${data.displayName || 'Not provided'}</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Email</td>
                  <td style="padding: 8px 12px; color: #111827; font-weight: 600;">${data.email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Method</td>
                  <td style="padding: 8px 12px; color: #111827;">${data.provider || 'Email'}</td>
                </tr>
                <tr style="background: white;">
                  <td style="padding: 8px 12px; color: #6b7280; font-size: 14px;">Date</td>
                  <td style="padding: 8px 12px; color: #111827;">${new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Johannesburg' })}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                <a href="https://unlimitedits.co.za/admin/customers" style="display: inline-block; background: #4f46e5; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">
                  View in Admin Panel
                </a>
              </div>
            </div>
          </div>
        `;
        break;
      }

      case 'new-order': {
        subject = `🛒 New Order #${data.orderId} — ${data.total || ''}`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 20px; border-radius: 12px 12px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 20px;">New Order Received</h1>
            </div>
            <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 12px 12px;">
              <p style="color: #374151;">Order <strong>#${data.orderId}</strong> from <strong>${data.customerEmail || 'Unknown'}</strong></p>
              <p style="color: #374151; font-size: 24px; font-weight: 700;">Total: ${data.total}</p>
              <p style="color: #6b7280; font-size: 14px;">Payment: ${data.paymentMethod || 'Unknown'}</p>
              <div style="margin-top: 20px;">
                <a href="https://unlimitedits.co.za/admin/orders" style="display: inline-block; background: #059669; color: white; padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 500;">
                  View Orders
                </a>
              </div>
            </div>
          </div>
        `;
        break;
      }

      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 });
    }

    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: config.adminEmail,
      subject,
      html,
    });

    return NextResponse.json({ sent: true });
  } catch (error) {
    console.error('Notification email error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
