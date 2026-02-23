import { getAllCompanies, getRolesForCompany } from '../../lib/research';

export async function GET() {
  const baseUrl = 'https://www.salaryprep.com';
  const now = new Date().toISOString();

  // Existing static pages
  const staticPages = [
    { loc: '', priority: '1.0', changefreq: 'weekly' },
    { loc: '/blog', priority: '0.9', changefreq: 'weekly' },
    { loc: '/quiz', priority: '0.9', changefreq: 'monthly' },
    { loc: '/calculator', priority: '0.9', changefreq: 'monthly' },
    { loc: '/companies', priority: '0.9', changefreq: 'weekly' },
    { loc: '/blog/how-to-negotiate-salary-new-job', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/counter-offer-email-template', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/how-to-ask-for-a-raise', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/negotiate-salary-big-tech', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/how-to-respond-lowball-offer', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/salary-negotiation-women', priority: '0.8', changefreq: 'monthly' },
    { loc: '/blog/get-raise-no-budget', priority: '0.8', changefreq: 'monthly' },
    { loc: '/new-offer', priority: '0.7', changefreq: 'monthly' },
    { loc: '/raise', priority: '0.7', changefreq: 'monthly' },
    { loc: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { loc: '/terms', priority: '0.3', changefreq: 'yearly' },
  ];

  // Dynamically generate company and role URLs from the research directory
  const companies = getAllCompanies();

  const companyPages = companies.map(c => ({
    loc: `/companies/${c}`,
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const rolePages = [];
  for (const company of companies) {
    const roles = getRolesForCompany(company);
    for (const role of roles) {
      rolePages.push({
        loc: `/companies/${company}/${role}`,
        priority: '0.6',
        changefreq: 'monthly',
      });
    }
  }

  const allPages = [...staticPages, ...companyPages, ...rolePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(p => `  <url>
    <loc>${baseUrl}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
