import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getDocument, updateDocument } from '@/lib/firebase';
import type { PaymentSettings } from '@/types';

const PAYFAST_SANDBOX_VALIDATE = 'https://sandbox.payfast.co.za/eng/query/validate';
const PAYFAST_LIVE_VALIDATE = 'https://www.payfast.co.za/eng/query/validate';

async function validateServerConfirmation(pfHost: string, pfParamString: string): Promise<boolean> {
  try {
    const url = pfHost;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: pfParamString,
    });
    const text = await response.text();
    return text === 'VALID';
  } catch {
    return false;
  }
}

function validateSignature(
  pfData: Record<string, string>,
  pfParamString: string,
  passphrase?: string
): boolean {
  const signatureString = passphrase
    ? `${pfParamString}&passphrase=${encodeURIComponent(passphrase.trim()).replace(/%20/g, '+')}`
    : pfParamString;
  const expectedSignature = crypto.createHash('md5').update(signatureString).digest('hex');
  return pfData.signature === expectedSignature;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = new URLSearchParams(body);
    const pfData: Record<string, string> = {};
    params.forEach((value, key) => {
      pfData[key] = value;
    });

    console.log('PayFast ITN received:', JSON.stringify(pfData));

    // Fetch payment settings
    const paymentData = await getDocument('settings', 'payment') as PaymentSettings | null;
    
    if (!paymentData?.payfast?.enabled) {
      console.error('PayFast is not enabled');
      return new NextResponse('OK', { status: 200 });
    }

    const { passphrase, sandbox } = paymentData.payfast;

    // Build param string (excluding signature)
    const pfParamString = Object.entries(pfData)
      .filter(([key]) => key !== 'signature')
      .map(([key, value]) => `${key}=${encodeURIComponent(value.trim()).replace(/%20/g, '+')}`)
      .join('&');

    // 1. Validate signature
    const signatureValid = validateSignature(pfData, pfParamString, passphrase || undefined);
    if (!signatureValid) {
      console.error('PayFast ITN: Invalid signature');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    // 2. Validate with PayFast server
    const validateUrl = sandbox ? PAYFAST_SANDBOX_VALIDATE : PAYFAST_LIVE_VALIDATE;
    const serverValid = await validateServerConfirmation(validateUrl, pfParamString);
    if (!serverValid) {
      console.error('PayFast ITN: Server validation failed');
      return new NextResponse('Server validation failed', { status: 400 });
    }

    // 3. Update order in Firestore
    const orderId = pfData.m_payment_id;
    const paymentStatus = pfData.payment_status;

    if (orderId) {
      const updateData: Record<string, unknown> = {
        paymentId: pfData.pf_payment_id || null,
        paymentMethod: 'payfast',
        updatedAt: new Date().toISOString(),
      };

      if (paymentStatus === 'COMPLETE') {
        updateData.paymentStatus = 'paid';
        updateData.status = 'processing';
      } else if (paymentStatus === 'CANCELLED') {
        updateData.paymentStatus = 'cancelled';
        updateData.status = 'cancelled';
      } else if (paymentStatus === 'FAILED') {
        updateData.paymentStatus = 'failed';
        updateData.status = 'cancelled';
      }

      await updateDocument('orders', orderId, updateData);
      console.log(`PayFast ITN: Order ${orderId} updated to ${paymentStatus}`);
    }

    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('PayFast ITN error:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
