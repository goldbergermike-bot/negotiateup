import { getAllCompanies } from '../../lib/companies';
import { getResearchCompanies, getCompanyRoles } from '../../lib/research';

export async function GET() {
  const baseUrl = 'https://www.salaryprep.com';
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { loc: '', priority: '1.0', freq: 'weekly' },
    { loc: '/blog', priority: '0.9', freq: 'weekly' },
    { loc: '/quiz', priority: '0.9', freq: 'monthly' },
    { loc: '/calculator', priority: '0.9', freq: 'monthly' },
    { loc: '/companies', priority: '0.9', freq: 'weekly' },
    { loc: '/new-offer', priority: '0.7', freq: 'monthly' },
    { loc: '/raise', priority: '0.7', freq: 'monthly' },
  ];

  const blogPosts = [
    '/blog/how-to-negotiate-salary-new-job',
    '/blog/counter-offer-email-template',
    '/blog/how-to-ask-for-a-raise',
    '/blog/negotiate-salary-big-tech',
    '/blog/how-to-respond-lowball-offer',
    '/blog/salary-negotiation-women',
    '/blog/get-raise-no-budget',
  ];

  // All company slugs (merged)
  const handcraftedSlugs = getAllCompanies().map(c => c.slug);
  const researchSlugs = getResearchCompanies();
  const allCompanySlugs = [...new Set([...handcraftedSlugs, ...researchSlugs])];

  // Build company + role URLs
  const companyUrls = [];
  for (const slug of allCompanySlugs) {
    companyUrls.push({ loc: `/companies/${slug}`, priority: '0.8', freq: 'monthly' });

    const roles = getCompanyRoles(slug);
    for (const role of roles) {
      companyUrls.push({ loc: `/companies/${slug}/${role}`, priority: '0.7', freq: 'monthly' });
    }
  }

  const urls = [
    ...staticPages.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
    ...blogPosts.map(p => `  <url>
    <loc>${baseUrl}${p}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`),
    ...companyUrls.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
