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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-paper/95 backdrop-blur-xl shadow-sm' : 'bg-paper/80 backdrop-blur-md'
    }`} style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        <a href="/" className="font-serif text-xl sm:text-2xl text-ink flex items-center gap-1.5">
          <span className="text-accent text-lg sm:text-xl">↑</span> NegotiateUp
        </a>
        <div className="flex items-center gap-4 sm:gap-6">
          <a href="/quiz" className="text-muted text-sm font-medium hover:text-ink transition-colors hidden sm:block">
            Am I Underpaid?
          </a>
          <a href="/calculator" className="text-muted text-sm font-medium hover:text-ink transition-colors hidden sm:block">
            Calculator
          </a>
          <a href="/companies" className="text-muted text-sm font-medium hover:text-ink transition-colors hidden sm:block">
            Companies
          </a>
          <a href="/blog" className="text-muted text-sm font-medium hover:text-ink transition-colors hidden sm:block">
            Blog
          </a>
          <a
            href="/#pricing"
            className="bg-accent text-white px-4 sm:px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-accent-glow transition-all hover:-translate-y-0.5"
          >
            Get Playbook →
          </a>
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-border/50 transition-colors"
            aria-label="Menu"
          >
            <span className="text-ink text-lg">{menuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>
      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-paper border-t border-border px-4 py-3 space-y-1">
          <a href="/quiz" className="block py-3 px-3 text-sm font-medium text-muted hover:text-ink hover:bg-accent-light/30 rounded-lg transition-colors">
            Am I Underpaid?
          </a>
          <a href="/calculator" className="block py-3 px-3 text-sm font-medium text-muted hover:text-ink hover:bg-accent-light/30 rounded-lg transition-colors">
            Calculator
          </a>
          <a href="/companies" className="block py-3 px-3 text-sm font-medium text-muted hover:text-ink hover:bg-accent-light/30 rounded-lg transition-colors">
            Companies
          </a>
          <a href="/blog" className="block py-3 px-3 text-sm font-medium text-muted hover:text-ink hover:bg-accent-light/30 rounded-lg transition-colors">
            Blog
          </a>
        </div>
      )}
    </nav>
  );
}
