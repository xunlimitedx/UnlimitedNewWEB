import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb, #1e40af)',
          borderRadius: 36,
        }}
      >
        <span style={{ fontSize: 110, color: 'white', fontWeight: 800 }}>∞</span>
      </div>
    ),
    { ...size }
  );
}
