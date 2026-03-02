import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'The Forge — Robert Blaylock | Senior Full Stack & 3D Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0806',
          position: 'relative',
        }}
      >
        {/* Subtle radial glow */}
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(196,129,58,0.15) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Anvil/flame icon (simplified) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {/* Flame shapes */}
          <svg width="80" height="100" viewBox="0 0 80 100">
            <defs>
              <linearGradient id="fg" x1="0.5" y1="1" x2="0.5" y2="0">
                <stop offset="0%" stopColor="#c4813a" />
                <stop offset="50%" stopColor="#e8a54b" />
                <stop offset="100%" stopColor="#ffaa44" />
              </linearGradient>
            </defs>
            <path
              d="M40 0 C40 0 10 40 15 60 C18 72 28 80 40 84 C52 80 62 72 65 60 C70 40 40 0 40 0Z"
              fill="url(#fg)"
            />
            <path
              d="M40 30 C40 30 26 55 30 68 C32 74 36 78 40 80 C44 78 48 74 50 68 C54 55 40 30 40 30Z"
              fill="#ffdd77"
              opacity="0.5"
            />
          </svg>

          {/* Anvil shape */}
          <svg width="120" height="50" viewBox="0 0 120 50" style={{ marginTop: -10 }}>
            <path d="M10 10 L110 10 L105 0 L15 0Z" fill="#3a2e20" stroke="#c4813a" strokeWidth="1" strokeOpacity="0.3" />
            <path d="M20 10 L100 10 L100 25 L20 25Z" fill="#2a1e14" />
            <path d="M5 25 L115 25 L118 40 L2 40Z" fill="#3a2e20" stroke="#c4813a" strokeWidth="1" strokeOpacity="0.3" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 56,
            fontWeight: 900,
            color: '#f5deb3',
            letterSpacing: 8,
            marginTop: 24,
            fontFamily: 'serif',
          }}
        >
          THE FORGE
        </div>

        {/* Divider */}
        <div
          style={{
            width: 200,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #c4813a, transparent)',
            marginTop: 16,
            marginBottom: 16,
          }}
        />

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 400,
            color: '#c4813a',
            letterSpacing: 4,
            textTransform: 'uppercase' as const,
          }}
        >
          Robert Blaylock
        </div>

        {/* Role */}
        <div
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: '#6a5a4a',
            letterSpacing: 3,
            marginTop: 8,
            textTransform: 'uppercase' as const,
          }}
        >
          Senior Full Stack & 3D Engineer
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            fontSize: 14,
            color: '#4a3d30',
            letterSpacing: 2,
          }}
        >
          rblaylock.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
