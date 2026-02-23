'use client';

import { useState, useEffect } from 'react';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change or resize
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener('resize', close);
    return () => window.removeEventListener('resize', close);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-paper/95 backdrop-blur-xl shadow-sm' : 'bg-paper/80 backdrop-blur-md'
    }`} style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center h-16">
        <a href="/" className="font-serif text-2xl text-ink flex items-center gap-2">
          <span className="text-accent text-xl">↑</span> SalaryPrep
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/quiz" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Am I Underpaid?
          </a>
          <a href="/calculator" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Calculator
          </a>
          <a href="/report" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Free Report
          </a>
          <a href="/companies" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Companies
          </a>
          <a href="/blog" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Blog
          </a>
          <a
            href="/#pricing"
            className="bg-accent text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-glow transition-all hover:-translate-y-0.5"
          >
            Get Your Playbook →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-ink transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-paper border-t border-border px-6 py-4 space-y-3">
          <a href="/quiz" onClick={() => setMenuOpen(false)} className="block text-muted text-sm font-medium hover:text-ink py-2">
            Am I Underpaid?
          </a>
          <a href="/calculator" onClick={() => setMenuOpen(false)} className="block text-muted text-sm font-medium hover:text-ink py-2">
            Calculator
          </a>
          <a href="/report" onClick={() => setMenuOpen(false)} className="block text-muted text-sm font-medium hover:text-ink py-2">
            Free Salary Report
          </a>
          <a href="/companies" onClick={() => setMenuOpen(false)} className="block text-muted text-sm font-medium hover:text-ink py-2">
            Companies
          </a>
          <a href="/blog" onClick={() => setMenuOpen(false)} className="block text-muted text-sm font-medium hover:text-ink py-2">
            Blog
          </a>
          <a
            href="/#pricing"
            onClick={() => setMenuOpen(false)}
            className="block bg-accent text-white px-6 py-3 rounded-lg font-semibold text-sm text-center hover:bg-accent-glow transition-all"
          >
            Get Your Playbook →
          </a>
        </div>
      )}
    </nav>
  );
}
