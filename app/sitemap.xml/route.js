import fs from 'fs';
import path from 'path';

export async function GET() {
  const baseUrl = 'https://www.salaryprep.com';
  const now = new Date().toISOString();

  // Static pages
  const staticPages = [
    { url: '', changefreq: 'weekly', priority: '1.0' },
    { url: '/blog', changefreq: 'weekly', priority: '0.9' },
    { url: '/quiz', changefreq: 'monthly', priority: '0.9' },
    { url: '/calculator', changefreq: 'monthly', priority: '0.9' },
    { url: '/report', changefreq: 'monthly', priority: '0.9' },
    { url: '/companies', changefreq: 'weekly', priority: '0.8' },
    { url: '/refer', changefreq: 'monthly', priority: '0.5' },
    { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
    { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  ];

  // Blog articles (all 20)
  const blogSlugs = [
    'how-to-negotiate-salary-new-job',
    'counter-offer-email-template',
    'how-to-ask-for-a-raise',
    'negotiate-salary-big-tech',
    'how-to-respond-lowball-offer',
    'salary-negotiation-women',
    'get-raise-no-budget',
    'when-to-negotiate-salary',
    'remote-work-salary-negotiation',
    'equity-stock-options-guide',
    'how-to-negotiate-promotion',
    'salary-negotiation-mistakes',
    'research-market-value',
    'negotiate-beyond-salary',
    'handle-we-cant-go-higher',
    'salary-negotiation-engineers',
    'negotiate-during-recession',
    'psychology-of-negotiation',
    'negotiate-internal-transfer',
    'first-time-salary-negotiation',
  ];

  // Dynamic company pages from /research/ directories
  let companyDirs = [];
  try {
    const researchDir = path.join(process.cwd(), 'research');
    companyDirs = fs.readdirSync(researchDir).filter((entry) => {
      const fullPath = path.join(researchDir, entry);
      return fs.statSync(fullPath).isDirectory() && !entry.startsWith('.');
    });
  } catch {
    companyDirs = [];
  }

  // Build XML
  let urls = '';

  // Static pages
  for (const page of staticPages) {
    urls += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }

  // Blog articles
  for (const slug of blogSlugs) {
    urls += `
  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  // Company pages (319 pages)
  for (const dir of companyDirs) {
    urls += `
  <url>
    <loc>${baseUrl}/companies/${dir}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}
