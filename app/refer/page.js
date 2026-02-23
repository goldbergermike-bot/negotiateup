'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

export default function ReferPage() {
  const [email, setEmail] = useState('');
  const [referralCode, setReferralCode] = useState(null);
  const [referralUrl, setReferralUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setReferralCode(data.code);
      setReferralUrl(data.url);

      if (typeof gtag === 'function') {
        gtag('event', 'referral_code_generated', { code: data.code });
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = referralUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main>
      <Nav />

      <section className="py-24 px-6 min-h-[80vh] flex items-center justify-center" style={{ background: 'var(--paper)' }}>
        <div className="max-w-lg w-full mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl md:text-4xl mb-4" style={{ color: 'var(--ink)' }}>
              Refer a Friend, Earn Rewards
            </h1>
            <p className="text-lg" style={{ color: 'var(--muted)' }}>
              Share SalaryPrep with friends and colleagues. Everyone wins.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl border p-8 mb-8" style={{ borderColor: 'var(--border)' }}>
            <h2 className="font-serif text-xl mb-6 text-center" style={{ color: 'var(--ink)' }}>
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>1</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Generate your unique link</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Enter your email below to get a personal referral link.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>2</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Share with friends</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>Your friends get 20% off their Playbook purchase.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'var(--accent)' }}>3</span>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--ink)' }}>Earn $5 credits</p>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>When they buy, you earn a $5 credit toward your next purchase.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Form / Result */}
          <div className="bg-white rounded-2xl border p-8" style={{ borderColor: 'var(--border)' }}>
            {!referralCode ? (
              <>
                <h2 className="font-serif text-xl mb-4 text-center" style={{ color: 'var(--ink)' }}>
                  Get Your Referral Link
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: 'var(--ink)' }}>
                      Your email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'var(--paper)',
                        color: 'var(--ink)',
                        focusRingColor: 'var(--accent)',
                      }}
                    />
                  </div>
                  {error && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'var(--accent)' }}
                  >
                    {loading ? 'Generating...' : 'Generate My Referral Link'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl" style={{ background: 'var(--accent-light)' }}>
                  🎉
                </div>
                <h2 className="font-serif text-xl mb-2" style={{ color: 'var(--ink)' }}>
                  Your Referral Link is Ready!
                </h2>
                <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>
                  Share this link with friends and colleagues:
                </p>

                {/* Link Display */}
                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="flex-1 px-4 py-3 rounded-xl text-sm font-mono truncate text-left"
                    style={{ background: 'var(--paper)', border: '1px solid var(--border)', color: 'var(--ink)' }}
                  >
                    {referralUrl}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 rounded-xl text-sm font-semibold text-white flex-shrink-0 transition-all hover:-translate-y-0.5"
                    style={{ background: copied ? '#16a34a' : 'var(--accent)' }}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                {/* Code Display */}
                <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                  Referral code: <span className="font-mono font-bold" style={{ color: 'var(--accent)' }}>{referralCode}</span>
                </p>

                {/* Reward Info */}
                <div className="mt-6 p-4 rounded-xl text-sm text-left" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  <p className="font-semibold mb-1">Reward details:</p>
                  <ul className="space-y-1">
                    <li>- Your friends get <strong>20% off</strong> their purchase</li>
                    <li>- When they buy, you earn a <strong>$5 credit</strong></li>
                  </ul>
                </div>

                {/* Generate another */}
                <button
                  onClick={() => {
                    setReferralCode(null);
                    setReferralUrl(null);
                    setEmail('');
                  }}
                  className="mt-6 text-sm underline"
                  style={{ color: 'var(--muted)' }}
                >
                  Generate for a different email
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
