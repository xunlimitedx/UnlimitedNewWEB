import { ImageResponse } from 'next/og';
import { getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const alt = 'Product image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let name = 'Product';
  let price = '';
  let category = '';

  try {
    const db = getAdminDb();
    const doc = await db.collection('products').doc(id).get();
    if (doc.exists) {
      const data = doc.data()!;
      name = data.name || 'Product';
      price = data.price
        ? new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(data.price)
        : '';
      category = data.category || '';
    }
  } catch {}

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #1e3a8a 0%, #172554 50%, #0f172a 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo area */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '60px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            Unlimited IT Solutions
          </div>
        </div>

        {/* Category badge */}
        {category && (
          <div
            style={{
              display: 'flex',
              marginBottom: '20px',
            }}
          >
            <div
              style={{
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '9999px',
                padding: '8px 20px',
                color: '#93c5fd',
                fontSize: '18px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {category}
            </div>
          </div>
        )}

        {/* Product name */}
        <div
          style={{
            fontSize: '52px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {name.length > 80 ? name.substring(0, 80) + '...' : name}
        </div>

        {/* Price */}
        {price && (
          <div
            style={{
              fontSize: '40px',
              fontWeight: 700,
              color: '#60a5fa',
            }}
          >
            {price}
          </div>
        )}

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '6px',
            background: 'linear-gradient(90deg, #3b82f6, #22c55e)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
