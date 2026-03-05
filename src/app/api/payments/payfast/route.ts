import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDocument } from '@/lib/firebase';
import type { PaymentSettings } from '@/types';

const PAYFAST_SANDBOX_URL = 'https://sandbox.payfast.co.za/eng/process';
const PAYFAST_LIVE_URL = 'https://www.payfast.co.za/eng/process';

function generateSignature(data: Record<string, string>, passphrase?: string): string {
  const params = Object.entries(data)
    .filter(([, value]) => value !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}`)
    .join('&');

  const signatureString = passphrase ? `${params}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}` : params;
  return crypto.createHash('md5').update(signatureString).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, itemName, firstName, lastName, email, returnUrl, cancelUrl, notifyUrl } = body;

    if (!orderId || !amount || !itemName || !email) {
      return NextResponse.json({ error: 'Missing required payment fields' }, { status: 400 });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: 'Invalid payment amount' }, { status: 400 });
    }

    // Fetch payment settings from Firestore
    const paymentData = await getDocument('settings', 'payment') as PaymentSettings | null;
    
    if (!paymentData?.payfast?.enabled) {
      return NextResponse.json({ error: 'PayFast is not enabled' }, { status: 400 });
    }

    const { merchantId, merchantKey, passphrase, sandbox } = paymentData.payfast;

    if (!merchantId || !merchantKey) {
      return NextResponse.json({ error: 'PayFast credentials not configured' }, { status: 500 });
    }

    const origin = request.nextUrl.origin;

    // Build PayFast data object — order matters for signature
    const pfData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: returnUrl || `${origin}/checkout/success`,
      cancel_url: cancelUrl || `${origin}/checkout?cancelled=true`,
      notify_url: notifyUrl || `${origin}/api/payments/payfast/notify`,
      name_first: firstName || '',
      name_last: lastName || '',
      email_address: email,
      m_payment_id: orderId,
      amount: parsedAmount.toFixed(2),
      item_name: itemName.substring(0, 100),
    };

    // Generate signature
    pfData.signature = generateSignature(pfData, passphrase || undefined);

    const actionUrl = sandbox ? PAYFAST_SANDBOX_URL : PAYFAST_LIVE_URL;

    return NextResponse.json({
      actionUrl,
      formData: pfData,
    });
  } catch (error) {
    console.error('PayFast payment error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    );
  }
}
