'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import PromoBanner from '../components/PromoBanner';
import Hero from '../components/Hero';
import StatBar from '../components/StatBar';
import TwoPaths from '../components/TwoPaths';
import PainPoints from '../components/PainPoints';
import HowItWorks from '../components/HowItWorks';
import WhatYouGet from '../components/WhatYouGet';
import Testimonials from '../components/Testimonials';
import Comparison from '../components/Comparison';
import WhyNotChatGPT from '../components/WhyNotChatGPT';
import FreeTools from '../components/FreeTools';
import Guarantee from '../components/Guarantee';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import EmailCapture from '../components/EmailCapture';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  const [referralBanner, setReferralBanner] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && /^[A-Za-z0-9]{6}$/.test(ref)) {
      // Store referral code in localStorage for use at checkout
      localStorage.setItem('sp_referral_code', ref);
      setReferralBanner(ref);
      // Fire GA4 event for referral landing
      if (typeof gtag === 'function') {
        gtag('event', 'referral_landing', { code: ref });
      }
    }
  }, []);

  return (
    <main>
      {referralBanner && (
        <div
          className="text-center py-3 px-6 text-sm font-semibold relative"
          style={{ background: 'var(--accent)', color: 'white' }}
        >
          You&apos;ve been referred! Use code{' '}
          <span className="font-mono bg-white/20 px-2 py-0.5 rounded">REF20</span>{' '}
          at checkout for 20% off.
          <button
            onClick={() => setReferralBanner(null)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-lg"
            aria-label="Dismiss referral banner"
          >
            &times;
          </button>
        </div>
      )}
      <PromoBanner />
      <Nav />
      <Hero />
      <StatBar />
      <PainPoints />
      <TwoPaths />
      <HowItWorks />
      <WhatYouGet />
      <Testimonials />
      <Comparison />
      <WhyNotChatGPT />
      <FreeTools />
      <Pricing />
      <Guarantee />
      <FAQ />
      <EmailCapture />
      <FinalCTA />
      <Footer />
    </main>
  );
}
