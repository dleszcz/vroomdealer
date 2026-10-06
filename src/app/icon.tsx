import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const isDev = process.env.NODE_ENV === 'development';
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          borderRadius: '8px',
          fontWeight: 900,
          fontFamily: "system-ui, sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          border: '1px solid #333333',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        VD
        {isDev && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '8px',
            background: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '6px',
            fontWeight: 800,
            color: 'white',
          }}>
            DEV
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
