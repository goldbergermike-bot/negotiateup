import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SalaryPrep — Your Personalized Salary Negotiation Playbook';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
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
            background: 'linear-gradient(90deg, #e8a838, #f0c060, #e8a838)',
            display: 'flex',
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span style={{ fontSize: '42px', color: '#e8a838', fontWeight: 'bold' }}>↑</span>
          <span style={{ fontSize: '36px', color: '#ffffff', fontWeight: 'bold', letterSpacing: '-0.5px' }}>
            SalaryPrep
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 'bold',
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
            display: 'flex',
          }}
        >
          Get paid what you're actually worth.
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            maxWidth: '700px',
            lineHeight: 1.5,
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          Personalized salary negotiation playbook with scripts, market data, and strategy. Ready in 10 minutes.
        </div>

        {/* CTA badge */}
        <div
          style={{
            background: '#e8a838',
            color: '#1a1a2e',
            padding: '14px 36px',
            borderRadius: '12px',
            fontSize: '22px',
            fontWeight: 'bold',
            display: 'flex',
          }}
        >
          Get My Playbook — $39
        </div>

        {/* Bottom stats */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            gap: '40px',
            color: 'rgba(255,255,255,0.5)',
            fontSize: '18px',
          }}
        >
          <span style={{ display: 'flex' }}>🤖 AI-Powered</span>
          <span style={{ display: 'flex' }}>⏱️ 10 Minutes</span>
          <span style={{ display: 'flex' }}>🔒 Money-Back Guarantee</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
