'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import Hero from '../components/Hero';
import StatBar from '../components/StatBar';
import TwoPaths from '../components/TwoPaths';
import PainPoints from '../components/PainPoints';
import HowItWorks from '../components/HowItWorks';
import WhatYouGet from '../components/WhatYouGet';
import Comparison from '../components/Comparison';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatBar />
      <TwoPaths />
      <PainPoints />
      <HowItWorks />
      <WhatYouGet />
      <Comparison />
      <Pricing />
      <FAQ />
      <FinalCTA />
      <Footer />
    </main>
  );
}
