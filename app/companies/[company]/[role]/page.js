import { notFound } from 'next/navigation';
import Link from 'next/link';
import Nav from '../../../../components/Nav';
import Footer from '../../../../components/Footer';
import MarkdownRenderer from '../../../../components/MarkdownRenderer';
import ResearchCTA from '../../../../components/ResearchCTA';
import RelatedBlogPosts from '../../../../components/RelatedBlogPosts';
import {
  getAllCompanyRolePairs,
  getResearchContent,
  extractMetadata,
  getRolesForCompany,
} from '../../../../lib/research';

// Static generation: pre-build all 4,466 pages at build time
export async function generateStaticParams() {
  return getAllCompanyRolePairs();
}

// Metadata: title, description, OG tags, canonical — all parsed from the markdown file
export async function generateMetadata({ params }) {
  const { company, role } = params;
  const markdown = getResearchContent(company, role);
  if (!markdown) return {};

  const { roleTitle, companyName, negotiationDna } = extractMetadata(markdown);

  const description = negotiationDna.length > 155
    ? negotiationDna.slice(0, 152) + '...'
    : negotiationDna || `Salary negotiation guide for ${roleTitle} at ${companyName}.`;

  const title = `${roleTitle} at ${companyName} — Salary Negotiation Guide | SalaryPrep`;
  const url = `https://www.salaryprep.com/companies/${company}/${role}`;

  return {
    title,
    description,
    keywords: [
      `${companyName} ${roleTitle} salary`,
      `${companyName} negotiation`,
      `${roleTitle} compensation`,
      'salary negotiation',
      `${companyName} offer negotiation`,
    ],
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      siteName: 'SalaryPrep',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function RoleResearchPage({ params }) {
  const { company, role } = params;

  // Read the markdown file — if it doesn't exist, 404 (no hallucination)
  const markdown = getResearchContent(company, role);
  if (!markdown) notFound();

  const { roleTitle, companyName } = extractMetadata(markdown);

  // Split content at the end of the compensation table to insert a mid-page CTA
  const lines = markdown.split('\n');
  let tableEndIndex = -1;

  // Find the last table row, then the next blank line after it
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('|') && !lines[i].startsWith('|--') && !lines[i].startsWith('| Region') && !lines[i].startsWith('| ---')) {
      tableEndIndex = i;
    }
  }

  // Move past the table to the next blank line
  if (tableEndIndex > 0) {
    for (let i = tableEndIndex + 1; i < lines.length; i++) {
      if (lines[i].trim() === '') {
        tableEndIndex = i;
        break;
      }
    }
  }

  let beforeCTA, afterCTA;
  if (tableEndIndex > 0) {
    beforeCTA = lines.slice(0, tableEndIndex + 1).join('\n');
    afterCTA = lines.slice(tableEndIndex + 1).join('\n');
  } else {
    // Fallback: show all content with CTA at end
    beforeCTA = markdown;
    afterCTA = '';
  }

  // Get other roles at this company for internal linking
  const allRoles = getRolesForCompany(company);
  const otherRoles = allRoles.filter(r => r !== role).slice(0, 6);

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${roleTitle} at ${companyName} — Salary Negotiation Guide`,
    publisher: {
      '@type': 'Organization',
      name: 'SalaryPrep',
      url: 'https://www.salaryprep.com',
    },
    mainEntityOfPage: `https://www.salaryprep.com/companies/${company}/${role}`,
  };

  return (
    <main>
      <Nav />
      <article className="pt-32 pb-20 px-6 max-w-[720px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="text-sm mb-6 flex items-center gap-2 text-muted flex-wrap">
          <Link href="/companies" className="text-accent font-medium hover:underline">
            Companies
          </Link>
          <span>/</span>
          <Link href={`/companies/${company}`} className="text-accent font-medium hover:underline">
            {companyName}
          </Link>
          <span>/</span>
          <span className="text-ink">{roleTitle}</span>
        </nav>

        {/* Tag */}
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-accent bg-accent-light px-3 py-1 rounded-full">
            Negotiation Guide
          </span>
        </div>

        {/* Content: title + compensation table */}
        <div className="prose-research">
          <MarkdownRenderer content={beforeCTA} />
        </div>

        {/* Mid-page CTA after compensation table */}
        <ResearchCTA companyName={companyName} roleTitle={roleTitle} />

        {/* Rest of content: detailed negotiation strategy */}
        {afterCTA && (
          <div className="prose-research">
            <MarkdownRenderer content={afterCTA} />
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-ink rounded-2xl p-10 text-center">
          <h2 className="font-serif text-2xl text-white mb-3">
            Ready to negotiate your {companyName} offer?
          </h2>
          <p className="text-white/60 mb-6 text-sm">
            Get a personalized playbook with exact counter-offer numbers and word-for-word scripts.
          </p>
          <a
            href="/#pricing"
            className="inline-block bg-white text-ink px-8 py-3 rounded-xl font-semibold hover:-translate-y-0.5 transition-all"
          >
            Get My Playbook — $39 →
          </a>
        </div>

        {/* Related blog articles */}
        <RelatedBlogPosts companySlug={company} />

        {/* Internal links to other roles at this company */}
        {otherRoles.length > 0 && (
          <div className="mt-12">
            <h3 className="font-serif text-xl mb-4">
              More {companyName} Negotiation Guides
            </h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {otherRoles.map(r => (
                <Link
                  key={r}
                  href={`/companies/${company}/${r}`}
                  className="bg-white rounded-xl p-4 border border-border hover:border-accent/40 hover:shadow-md transition-all block text-sm"
                >
                  <span className="font-semibold text-ink">{extractMetadata(getResearchContent(company, r) || '').roleTitle || r}</span>
                  <span className="block text-xs text-accent mt-1">View guide →</span>
                </Link>
              ))}
            </div>
            <Link
              href={`/companies/${company}`}
              className="inline-block mt-4 text-accent text-sm font-semibold hover:underline"
            >
              View all {companyName} roles →
            </Link>
          </div>
        )}

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </article>
      <Footer />
    </main>
  );
}
