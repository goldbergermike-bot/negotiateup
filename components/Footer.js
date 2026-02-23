export default function Footer() {
  return (
    <footer className="py-8 px-6 text-center text-sm text-muted" style={{ borderTop: '1px solid var(--border)' }}>
      <p>© 2026 SalaryPrep. All rights reserved.</p>
      <p className="mt-2">
        <a href="/companies" className="text-muted hover:text-ink">Companies</a>
        {' · '}
        <a href="/blog" className="text-muted hover:text-ink">Blog</a>
        {' · '}
        <a href="/refer" className="text-muted hover:text-ink">Refer a Friend</a>
        {' · '}
        <a href="/privacy" className="text-muted hover:text-ink">Privacy</a>
        {' · '}
        <a href="/terms" className="text-muted hover:text-ink">Terms</a>
      </p>
    </footer>
  );
}
