'use client';

import { useState } from 'react';
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
  return (
    <main>
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
