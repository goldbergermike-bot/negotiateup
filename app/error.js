'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-6">😅</div>
        <h1 className="font-serif text-3xl mb-4">Something went wrong</h1>
        <p className="text-muted text-lg mb-8">
          We hit an unexpected error. This has been logged and we'll look into it.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-accent text-white px-6 py-3 rounded-xl font-semibold text-sm hover:-translate-y-0.5 transition-all"
          >
            Try Again
          </button>
          <a
            href="/"
            className="bg-white text-ink px-6 py-3 rounded-xl font-semibold text-sm border border-border hover:-translate-y-0.5 transition-all"
          >
            Go Home
          </a>
        </div>
        {process.env.NODE_ENV === 'development' && error?.message && (
          <pre className="mt-8 text-left bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-700 overflow-auto max-h-48">
            {error.message}
            {error.stack && `\n\n${error.stack}`}
          </pre>
        )}
      </div>
    </div>
  );
}
