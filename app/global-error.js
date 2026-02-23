'use client';

// Global error boundary — catches errors in root layout itself
// Uses inline styles since globals.css may not be loaded
export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', background: '#faf8f5' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{ fontSize: '48px', marginBottom: '24px' }}>😅</div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '16px' }}>
              Something went wrong
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '32px', lineHeight: 1.6 }}>
              We're sorry — something unexpected happened. Please try refreshing the page.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => reset()}
                style={{
                  background: '#2d6a4f',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <a
                href="/"
                style={{
                  background: 'white',
                  color: '#1a1a1a',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '14px',
                  border: '1px solid #e5e2dd',
                  textDecoration: 'none',
                }}
              >
                Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
