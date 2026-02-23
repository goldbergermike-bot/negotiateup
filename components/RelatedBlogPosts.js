import Link from 'next/link';
import { getRelatedBlogPosts } from '../lib/crosslinks';

/**
 * Server Component — shows 2-3 related blog post cards on company role pages.
 * All data is hardcoded in lib/crosslinks.js — zero file reads, zero API calls.
 */
export default function RelatedBlogPosts({ companySlug }) {
  const posts = getRelatedBlogPosts(companySlug);
  if (posts.length === 0) return null;

  return (
    <div className="mt-12">
      <h3 className="font-serif text-xl mb-4">
        Related Negotiation Articles
      </h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {posts.map(post => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="bg-white rounded-xl p-4 border border-border hover:border-accent/40 hover:shadow-md transition-all block"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-accent bg-accent-light px-2 py-0.5 rounded-full">
              {post.tag}
            </span>
            <span className="block font-semibold text-sm text-ink mt-2 leading-snug">
              {post.title}
            </span>
            <span className="block text-xs text-accent mt-2 font-semibold">
              Read article →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
