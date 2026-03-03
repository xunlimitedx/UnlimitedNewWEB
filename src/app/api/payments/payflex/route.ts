import { NextRequest, NextResponse } from 'next/server';
import { getDocument } from '@/lib/firebase';
import type { PaymentSettings } from '@/types';

const PAYFLEX_SANDBOX_URL = 'https://api.sandbox.payflex.co.za/order';
const PAYFLEX_LIVE_URL = 'https://api.payflex.co.za/order';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, amount, items, consumer, merchantReference } = body;

    if (!orderId || !amount || !consumer?.email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch payment settings
    const paymentData = await getDocument('settings', 'payment') as PaymentSettings | null;

    if (!paymentData?.payflex?.enabled) {
      return NextResponse.json({ error: 'PayFlex is not enabled' }, { status: 400 });
    }

    const { apiKey, sandbox } = paymentData.payflex;

    if (!apiKey) {
      return NextResponse.json({ error: 'PayFlex API key not configured' }, { status: 500 });
    }

    const origin = request.nextUrl.origin;
    const apiUrl = sandbox ? PAYFLEX_SANDBOX_URL : PAYFLEX_LIVE_URL;

    const orderPayload = {
      amount: {
        amount: parseFloat(amount).toFixed(2),
        currency: 'ZAR',
      },
      consumer: {
        phoneNumber: consumer.phone || '',
        givenNames: consumer.firstName || '',
        surname: consumer.lastName || '',
        email: consumer.email,
      },
      merchant: {
        redirectConfirmUrl: `${origin}/checkout/success?orderId=${orderId}`,
        redirectCancelUrl: `${origin}/checkout?cancelled=true`,
        statusCallbackUrl: `${origin}/api/payments/payflex/notify`,
      },
      merchantReference: merchantReference || orderId,
      description: `Order #${orderId}`,
      items: (items || []).map((item: { name: string; quantity: number; price: number }) => ({
        description: item.name,
        name: item.name,
        quantity: item.quantity,
        price: {
          amount: parseFloat(String(item.price)).toFixed(2),
          currency: 'ZAR',
        },
      })),
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayFlex API error:', errorText);
      return NextResponse.json(
        { error: 'PayFlex order creation failed', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      redirectUrl: data.redirectUrl || data.checkoutUrl,
      token: data.token,
      orderId: data.orderId,
    });
  } catch (error) {
    console.error('PayFlex payment error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate PayFlex payment' },
      { status: 500 }
    );
  }
}
