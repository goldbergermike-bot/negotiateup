// BlogPosting JSON-LD structured data for blog articles.
// Helps Google show rich results (article title, date, author in SERPs).

export default function BlogJsonLd({ title, description, slug, datePublished, dateModified }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    url: `https://www.salaryprep.com/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: 'SalaryPrep',
      url: 'https://www.salaryprep.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'SalaryPrep',
      url: 'https://www.salaryprep.com',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.salaryprep.com/blog/${slug}`,
    },
    image: `https://www.salaryprep.com/blog/${slug}/opengraph-image`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
