import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Unlimited IT Solutions – Technology for Tomorrow';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Infinity Symbol */}
        <div
          style={{
            fontSize: 120,
            color: '#60a5fa',
            marginBottom: 8,
            fontWeight: 800,
            display: 'flex',
          }}
        >
          ∞
        </div>

        {/* Company Name */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: 'white',
            letterSpacing: '-1px',
            display: 'flex',
          }}
        >
          Unlimited IT Solutions
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#93c5fd',
            marginTop: 12,
            display: 'flex',
          }}
        >
          Technology for Tomorrow
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #2563eb, #22c55e, #2563eb)',
            display: 'flex',
          }}
        />

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 30,
            fontSize: 18,
            color: '#64748b',
            display: 'flex',
          }}
        >
          unlimitedits.co.za
        </div>
      </div>
    ),
    { ...size }
  );
}
