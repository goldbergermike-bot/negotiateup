import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generate a blog post OG image with title and tag.
 * Usage in each blog's opengraph-image.js:
 *   export { runtime, size, contentType } from '../../../lib/og-blog';
 *   export default () => generateBlogOG({ title: '...', tag: '...' });
 */
export function generateBlogOG({ title, tag }) {
  // Color schemes per tag
  const tagColors = {
    'Big Tech': { bg: '#0f3460', accent: '#e8a838' },
    'Job Offers': { bg: '#1a3a2a', accent: '#4ade80' },
    'Negotiation': { bg: '#3b1a45', accent: '#c084fc' },
    'Scripts & Templates': { bg: '#1a2a3b', accent: '#60a5fa' },
    'Raises': { bg: '#3b2a1a', accent: '#fb923c' },
    'Strategy': { bg: '#1a3b3b', accent: '#2dd4bf' },
  };

  const colors = tagColors[tag] || { bg: '#1a1a2e', accent: '#e8a838' };

  return new ImageResponse(
    (
      <div
        style={{
          background: `linear-gradient(135deg, ${colors.bg} 0%, #1a1a2e 100%)`,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: colors.accent,
            display: 'flex',
          }}
        />

        {/* Tag badge */}
        <div
          style={{
            display: 'flex',
            marginBottom: '24px',
          }}
        >
          <span
            style={{
              background: `${colors.accent}22`,
              border: `2px solid ${colors.accent}`,
              color: colors.accent,
              padding: '8px 20px',
              borderRadius: '24px',
              fontSize: '18px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              display: 'flex',
            }}
          >
            {tag}
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: title.length > 50 ? '44px' : '52px',
            fontWeight: 'bold',
            color: '#ffffff',
            lineHeight: 1.2,
            maxWidth: '900px',
            flex: 1,
            display: 'flex',
            alignItems: 'flex-start',
          }}
        >
          {title}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: '24px',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px', color: colors.accent, fontWeight: 'bold' }}>↑</span>
            <span style={{ fontSize: '28px', color: '#ffffff', fontWeight: 'bold' }}>SalaryPrep</span>
          </div>
          {/* URL */}
          <span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', display: 'flex' }}>
            salaryprep.com/blog
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
