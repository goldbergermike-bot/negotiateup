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

  // Close menu on route change (anchor clicks)
  const closeMenu = () => setMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-paper/95 backdrop-blur-xl shadow-sm' : 'bg-paper/80 backdrop-blur-md'
    }`} style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-[1100px] mx-auto px-6 flex justify-between items-center h-16">
        <a href="/" className="font-serif text-2xl text-ink flex items-center gap-2">
          <span className="text-accent text-xl">↑</span> SalaryPrep
        </a>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-6">
          <a href="/quiz" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Am I Underpaid?
          </a>
          <a href="/calculator" className="text-muted text-sm font-medium hover:text-ink transition-colors">
            Calculator
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

        {/* Mobile: Blog + CTA + Hamburger */}
        <div className="flex sm:hidden items-center gap-3">
          <a
            href="/#pricing"
            className="bg-accent text-white px-4 py-2 rounded-lg font-semibold text-sm"
          >
            Get Playbook
          </a>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-ink rounded-lg hover:bg-ink/5 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              /* X icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      {menuOpen && (
        <div className="sm:hidden bg-paper border-t border-border">
          <div className="px-6 py-4 flex flex-col gap-1">
            <a href="/quiz" onClick={closeMenu} className="text-ink font-medium py-3 border-b border-border/50 flex items-center gap-3">
              <span className="text-lg">📊</span> Am I Underpaid? Quiz
            </a>
            <a href="/calculator" onClick={closeMenu} className="text-ink font-medium py-3 border-b border-border/50 flex items-center gap-3">
              <span className="text-lg">🧮</span> Counter-Offer Calculator
            </a>
            <a href="/companies" onClick={closeMenu} className="text-ink font-medium py-3 border-b border-border/50 flex items-center gap-3">
              <span className="text-lg">🏢</span> Company Guides
            </a>
            <a href="/blog" onClick={closeMenu} className="text-ink font-medium py-3 flex items-center gap-3">
              <span className="text-lg">📝</span> Blog
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
