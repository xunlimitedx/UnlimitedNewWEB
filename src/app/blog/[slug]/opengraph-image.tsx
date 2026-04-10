import { ImageResponse } from 'next/og';
import { getAdminDb } from '@/lib/firebase-admin';

export const runtime = 'nodejs';
export const alt = 'Blog post image';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let title = 'Blog Post';
  let author = '';
  let category = '';

  try {
    const db = getAdminDb();
    const snap = await db.collection('blog').where('slug', '==', slug).limit(1).get();
    if (!snap.empty) {
      const data = snap.docs[0].data();
      title = data.title || 'Blog Post';
      author = data.author || '';
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
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          padding: '60px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Logo */}
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
              fontSize: '24px',
              fontWeight: 800,
              color: '#94a3b8',
            }}
          >
            Unlimited IT Solutions &middot; Blog
          </div>
        </div>

        {/* Category badge */}
        {category && (
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <div
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                borderRadius: '9999px',
                padding: '8px 20px',
                color: '#60a5fa',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {category}
            </div>
          </div>
        )}

        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '1000px',
          }}
        >
          {title.length > 100 ? title.substring(0, 100) + '...' : title}
        </div>

        {/* Author */}
        {author && (
          <div
            style={{
              fontSize: '22px',
              color: '#94a3b8',
              fontWeight: 500,
            }}
          >
            By {author}
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
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
          }}
        />
      </div>
    ),
    { ...size }
  );
}
