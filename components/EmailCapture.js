'use client';

import { useState } from 'react';

export default function EmailCapture() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: Connect to Resend audience, Mailchimp, or other email service
    // For now, show a message indicating the feature is coming soon
    setSubmitted(true);
  };

  return (
    <section className="py-16 px-6" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[600px] mx-auto text-center">
        {submitted ? (
          <div>
            <span className="text-3xl mb-3 block">✅</span>
            <h3 className="font-serif text-2xl mb-2">Thanks for your interest!</h3>
            <p className="text-muted text-sm">Email list coming soon. In the meantime, check out our <a href="/blog" className="text-accent hover:underline">blog</a> for free negotiation tips.</p>
          </div>
        ) : (
          <>
            <h3 className="font-serif text-2xl mb-2">Not ready yet? Get free negotiation tips.</h3>
            <p className="text-muted text-sm mb-6">
              Join our email list and we'll send you our best salary negotiation advice — plus an exclusive discount when you're ready.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-[440px] mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
              />
              <button
                type="submit"
                className="bg-ink text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-ink/90 transition-all whitespace-nowrap"
              >
                Send Tips →
              </button>
            </form>
            <p className="text-xs text-muted mt-3">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  );
}
