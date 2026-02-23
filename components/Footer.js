export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center text-sm text-muted" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="mb-2">
        <a href="/companies" className="text-muted hover:text-ink">Company Guides</a> · <a href="/blog" className="text-muted hover:text-ink">Blog</a> · <a href="/quiz" className="text-muted hover:text-ink">Am I Underpaid?</a> · <a href="/calculator" className="text-muted hover:text-ink">Calculator</a>
      </p>
      <p>© 2026 SalaryPrep. All rights reserved. · <a href="/privacy" className="text-muted hover:text-ink">Privacy</a> · <a href="/terms" className="text-muted hover:text-ink">Terms</a></p>
    </footer>
  );
}
