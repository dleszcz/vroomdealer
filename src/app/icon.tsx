import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const isDev = process.env.NODE_ENV === 'development';
  // Jasnoniebieski na localhost, Ciemniejszy niebieski na produkcji
  const fillColor = isDev ? '#60a5fa' : '#2563eb'; 

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#09090b',
          borderRadius: '8px',
        }}
      >
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <path
            transform="translate(3.0 -3.6) scale(0.94)"
            fillRule="evenodd"
            fill={fillColor}
            d="M30 20H70L78.4 34H91L92 40L85 43L95 47L97 62L96 79L93 94H73L71 84H29L27 94H7L4 79L3 62L5 47L15 43L8 40L9 34H21.6Z M34 26H66L75 40H25Z M10 52L17 47L33 54L17 58Z M90 52L83 47L67 54L83 58Z M36 52H47L50 66L53 52H64L56 78H44Z M12 67H29L26 73H14Z M88 67H71L74 73H86Z"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
