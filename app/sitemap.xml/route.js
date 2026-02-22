import { getCompanySlugs } from '../../lib/companies';

export async function GET() {
  const baseUrl = 'https://www.negotiateup.com';
  const now = new Date().toISOString();
  const companySlugs = getCompanySlugs();

  const staticPages = [
    { loc: '', priority: '1.0', changefreq: 'weekly' },
    { loc: '/companies', priority: '0.9', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: '/quiz', priority: '0.9', changefreq: 'monthly' },
    { loc: '/calculator', priority: '0.9', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
    { loc: '/blog/how-to-negotiate-salary-new-job', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/counter-offer-email-template', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/how-to-ask-for-a-raise', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/negotiate-salary-big-tech', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/how-to-respond-lowball-offer', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/salary-negotiation-women', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/get-raise-no-budget', priority: '0.8', changefreq: 'monthly' },
  ];

  const staticXml = staticPages.map((p) => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n');

  const companyXml = companySlugs.map((slug) => `  <url>
    <loc>${baseUrl}/companies/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticXml}
${companyXml}
</urlset>`;

  return new Response(sitemap, {
    headers: { 'Content-Type': 'application/xml' },
  });
}
