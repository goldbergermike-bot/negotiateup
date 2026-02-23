import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main>
      <Nav />
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">🔍</div>
          <h1 className="font-serif text-3xl mb-4">Page not found</h1>
          <p className="text-muted text-lg mb-8">
            The page you're looking for doesn't exist or may have been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all text-center"
            >
              Go Home
            </Link>
            <Link
              href="/blog"
              className="bg-white text-ink px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:-translate-y-0.5 transition-all text-center"
            >
              Read the Blog
            </Link>
            <Link
              href="/companies"
              className="bg-white text-ink px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:-translate-y-0.5 transition-all text-center"
            >
              Browse Companies
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
