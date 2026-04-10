// Branded HTML Email Templates for Unlimited IT Solutions

const BRAND_COLOR = '#2563eb';
const LOGO_URL = 'https://unlimitedits.co.za/images/logo.png';

function baseLayout(content: string, preheader?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Unlimited IT Solutions</title>
  ${preheader ? `<span style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheader}</span>` : ''}
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
    <tr><td align="center" style="padding:24px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <!-- Header -->
        <tr><td style="background-color:${BRAND_COLOR};padding:24px;text-align:center;">
          <img src="${LOGO_URL}" alt="Unlimited IT Solutions" height="40" style="height:40px;width:auto;" />
          <p style="color:#ffffff;margin:8px 0 0;font-size:14px;opacity:0.9;">Computer Repairs · IT Support · Sales</p>
        </td></tr>
        <!-- Content -->
        <tr><td style="padding:32px 24px;">
          ${content}
        </td></tr>
        <!-- Footer -->
        <tr><td style="background-color:#1f2937;padding:24px;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0 0 8px;">Unlimited IT Solutions (Pty) Ltd</p>
          <p style="color:#9ca3af;font-size:12px;margin:0 0 4px;">202 Marine Drive, Ramsgate, KZN 4285</p>
          <p style="color:#9ca3af;font-size:12px;margin:0 0 12px;">Tel: 039 314 4359 | Cell: 082 556 9875</p>
          <p style="color:#6b7280;font-size:11px;margin:0;">© ${new Date().getFullYear()} Unlimited IT Solutions. All rights reserved.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function formatCurrencyEmail(amount: number): string {
  return `R ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

export function orderConfirmationEmail(order: {
  id: string;
  items: { name: string; quantity: number; price: number; image?: string }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  discount?: number;
  customerName: string;
  shippingAddress: { street: string; city: string; province: string; postalCode: string };
  paymentMethod: string;
}): { subject: string; html: string } {
  const itemRows = order.items.map(item => `
    <tr>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
        <p style="margin:0;font-size:14px;font-weight:600;color:#111827;">${item.name}</p>
        <p style="margin:2px 0 0;font-size:12px;color:#6b7280;">Qty: ${item.quantity}</p>
      </td>
      <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;text-align:right;font-size:14px;color:#111827;">
        ${formatCurrencyEmail(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const content = `
    <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">Order Confirmed! 🎉</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${order.customerName}, thank you for your order.</p>
    
    <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#166534;font-weight:600;">Order #${order.id}</p>
      <p style="margin:4px 0 0;font-size:12px;color:#15803d;">Payment: ${order.paymentMethod}</p>
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr><td colspan="2" style="padding-bottom:8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.05em;">Items</td></tr>
      ${itemRows}
      <tr><td style="padding:8px 0;font-size:14px;color:#6b7280;">Subtotal</td><td style="text-align:right;font-size:14px;color:#111827;">${formatCurrencyEmail(order.subtotal)}</td></tr>
      ${order.discount ? `<tr><td style="padding:4px 0;font-size:14px;color:#059669;">Discount</td><td style="text-align:right;font-size:14px;color:#059669;">-${formatCurrencyEmail(order.discount)}</td></tr>` : ''}
      <tr><td style="padding:4px 0;font-size:14px;color:#6b7280;">Shipping</td><td style="text-align:right;font-size:14px;color:#111827;">${order.shipping === 0 ? 'FREE' : formatCurrencyEmail(order.shipping)}</td></tr>
      <tr><td style="padding:4px 0;font-size:14px;color:#6b7280;">VAT (15%)</td><td style="text-align:right;font-size:14px;color:#111827;">${formatCurrencyEmail(order.tax)}</td></tr>
      <tr><td style="padding:12px 0 0;font-size:18px;font-weight:700;color:#111827;border-top:2px solid #e5e7eb;">Total</td><td style="text-align:right;padding:12px 0 0;font-size:18px;font-weight:700;color:${BRAND_COLOR};border-top:2px solid #e5e7eb;">${formatCurrencyEmail(order.total)}</td></tr>
    </table>

    <div style="margin-top:24px;padding:16px;background-color:#f9fafb;border-radius:8px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;">Shipping To</p>
      <p style="margin:0;font-size:14px;color:#111827;">${order.shippingAddress.street}</p>
      <p style="margin:0;font-size:14px;color:#111827;">${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.postalCode}</p>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="https://unlimitedits.co.za/account/orders" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">View Order</a>
    </div>
  `;

  return {
    subject: `Order Confirmed - #${order.id} | Unlimited IT Solutions`,
    html: baseLayout(content, `Your order #${order.id} has been confirmed.`),
  };
}

export function shippingNotificationEmail(data: {
  customerName: string;
  orderId: string;
  trackingNumber: string;
  courier: string;
  trackingUrl?: string;
}): { subject: string; html: string } {
  const content = `
    <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">Your Order is On Its Way! 📦</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${data.customerName}, great news — your order #${data.orderId} has been shipped.</p>
    
    <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px;margin-bottom:24px;">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;color:${BRAND_COLOR};text-transform:uppercase;">Tracking Details</p>
      <p style="margin:0 0 4px;font-size:14px;color:#111827;">Courier: <strong>${data.courier}</strong></p>
      <p style="margin:0;font-size:14px;color:#111827;">Tracking: <strong>${data.trackingNumber}</strong></p>
    </div>

    ${data.trackingUrl ? `<div style="text-align:center;margin-top:24px;">
      <a href="${data.trackingUrl}" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">Track Shipment</a>
    </div>` : ''}
  `;

  return {
    subject: `Your Order #${data.orderId} Has Been Shipped! | Unlimited IT Solutions`,
    html: baseLayout(content, `Your order is on its way! Tracking: ${data.trackingNumber}`),
  };
}

export function welcomeEmail(name: string): { subject: string; html: string } {
  const content = `
    <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">Welcome to Unlimited IT Solutions! 👋</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${name}, thanks for creating an account. We're your one-stop shop for IT repairs, support, and tech products.</p>
    
    <div style="display:flex;gap:16px;margin-bottom:24px;">
      <div style="flex:1;background-color:#f9fafb;border-radius:8px;padding:16px;text-align:center;">
        <p style="font-size:24px;margin:0;">🔧</p>
        <p style="font-size:13px;font-weight:600;color:#111827;margin:4px 0 0;">Expert Repairs</p>
      </div>
      <div style="flex:1;background-color:#f9fafb;border-radius:8px;padding:16px;text-align:center;">
        <p style="font-size:24px;margin:0;">🛒</p>
        <p style="font-size:13px;font-weight:600;color:#111827;margin:4px 0 0;">Shop Online</p>
      </div>
      <div style="flex:1;background-color:#f9fafb;border-radius:8px;padding:16px;text-align:center;">
        <p style="font-size:24px;margin:0;">🚚</p>
        <p style="font-size:13px;font-weight:600;color:#111827;margin:4px 0 0;">Fast Delivery</p>
      </div>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="https://unlimitedits.co.za/products" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:14px;font-weight:600;">Start Shopping</a>
    </div>
  `;

  return {
    subject: `Welcome to Unlimited IT Solutions! | ${name}`,
    html: baseLayout(content, `Welcome aboard, ${name}! Start shopping now.`),
  };
}

export function passwordResetEmail(name: string, resetLink: string): { subject: string; html: string } {
  const content = `
    <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px;">Reset Your Password</h1>
    <p style="color:#6b7280;font-size:14px;margin:0 0 24px;">Hi ${name}, we received a request to reset your password. Click the button below:</p>
    
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetLink}" style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:14px;font-weight:600;">Reset Password</a>
    </div>

    <p style="color:#9ca3af;font-size:12px;text-align:center;">If you didn't request this, you can safely ignore this email.</p>
  `;

  return {
    subject: 'Password Reset Request | Unlimited IT Solutions',
    html: baseLayout(content, 'Reset your password for Unlimited IT Solutions.'),
  };
}
