import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#eff6ff', // Light blue background for Apple icon square
          borderRadius: '40px',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="3" fill="#ffffff"></rect>
          <line x1="8" y1="6" x2="16" y2="6" stroke="#1d4ed8" strokeWidth="3"></line>
          
          <line x1="16" y1="14" x2="16" y2="14.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="16" y1="10" x2="16" y2="10.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="16" y1="18" x2="16" y2="18.01" strokeWidth="2" strokeLinecap="round"></line>
          
          <line x1="12" y1="14" x2="12" y2="14.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="12" y1="10" x2="12" y2="10.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round"></line>
          
          <line x1="8" y1="14" x2="8" y2="14.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="8" y1="10" x2="8" y2="10.01" strokeWidth="2" strokeLinecap="round"></line>
          <line x1="8" y1="18" x2="8" y2="18.01" strokeWidth="2" strokeLinecap="round"></line>
        </svg>
      </div>
    ),
    { ...size }
  );
}
