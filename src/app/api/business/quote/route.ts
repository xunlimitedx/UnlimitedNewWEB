import { NextRequest, NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const required = ['company', 'name', 'email', 'phone', 'location', 'requirements'];
    for (const field of required) {
      if (!data[field] || typeof data[field] !== 'string') {
        return NextResponse.json({ error: `Missing ${field}` }, { status: 400 });
      }
    }
    if (data.requirements.length > 5000) {
      return NextResponse.json({ error: 'Requirements too long' }, { status: 400 });
    }
    await getAdminDb().collection('business-quotes').add({
      company: String(data.company).slice(0, 200),
      vat: String(data.vat || '').slice(0, 50),
      name: String(data.name).slice(0, 200),
      email: String(data.email).slice(0, 200),
      phone: String(data.phone).slice(0, 50),
      location: String(data.location).slice(0, 200),
      requirements: String(data.requirements).slice(0, 5000),
      status: 'new',
      createdAt: new Date(),
    });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('business quote error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
