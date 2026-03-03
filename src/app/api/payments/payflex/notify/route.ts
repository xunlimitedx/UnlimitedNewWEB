import { NextRequest, NextResponse } from 'next/server';
import { updateDocument } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, merchantReference } = body;

    console.log('PayFlex callback received:', JSON.stringify(body));

    const orderRef = merchantReference || orderId;

    if (orderRef) {
      const updateData: Record<string, unknown> = {
        paymentMethod: 'payflex',
        updatedAt: new Date().toISOString(),
      };

      if (status === 'APPROVED' || status === 'COMPLETED') {
        updateData.paymentStatus = 'paid';
        updateData.status = 'processing';
        updateData.payflexOrderId = orderId || null;
      } else if (status === 'DECLINED' || status === 'ABANDONED') {
        updateData.paymentStatus = 'failed';
        updateData.status = 'cancelled';
      }

      await updateDocument('orders', orderRef, updateData);
      console.log(`PayFlex: Order ${orderRef} updated to ${status}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('PayFlex callback error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
