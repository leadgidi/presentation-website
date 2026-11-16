import { ImageResponse } from 'next/og';
import { hero } from '@/content/home';
import { site } from '@/content/site';

export const dynamic = 'force-static';

const MARK_PATH = 'M70 72 A26 26 0 0 1 122 72 V138 C122 158 134 168 158 168 L178 168 C178 190 152 200 124 200 C92 200 70 180 70 150 Z';

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
          background: 'linear-gradient(110deg, #0b0c0e 55%, #2a2d32 100%)',
          color: '#e6e8eb',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 40, fontWeight: 700 }}>
          <svg width="56" height="56" viewBox="0 0 240 240">
            <g transform="translate(-11 -16)">
              <path d={MARK_PATH} fill="#ffffff" />
              <circle cx="170" cy="118" r="22" fill="#ffffff" />
            </g>
          </svg>
          {site.company}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 96, fontWeight: 600, lineHeight: 1, letterSpacing: -4 }}>{hero.title}</div>
          <div style={{ fontSize: 34, color: '#9aa0a6' }}>{site.seoDescription}</div>
        </div>
        <div style={{ fontSize: 28, color: '#ffffff' }}>{site.domain}</div>
      </div>
    ),
    size,
  );
}
