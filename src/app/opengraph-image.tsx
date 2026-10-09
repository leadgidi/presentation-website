import { ImageResponse } from 'next/og';
import { site } from '@/content/site';

export const dynamic = 'force-static';

export const alt = site.seoTitle;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(110deg, #07090b 55%, #123036 100%)',
          color: '#e4ebea',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 36, fontWeight: 700 }}>{site.company}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: -4 }}>{site.headline}</div>
          <div style={{ fontSize: 34, color: '#8c9ba3' }}>{site.taglines[0]}</div>
        </div>
        <div style={{ fontSize: 28, color: '#63c4c8' }}>{site.comingSoon}</div>
      </div>
    ),
    size,
  );
}
