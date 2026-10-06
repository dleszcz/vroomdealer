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
          background: isDev ? '#f97316' : '#000000', // Orange in DEV, Black in PROD
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
          border: '1px solid #333333'
        }}
      >
        {isDev ? 'DEV' : 'VD'}
      </div>
    ),
    { ...size }
  )
}
