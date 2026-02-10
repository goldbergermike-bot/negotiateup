import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'SalaryPrep — Your Personalized Salary Negotiation Playbook',
  description: 'Get a personalized salary negotiation playbook with exact scripts, market data, and strategy. Works for new job offers and raise requests. Ready in 10 minutes.',
  metadataBase: new URL('https://www.salaryprep.com'),
  keywords: ['salary negotiation', 'negotiate salary', 'counter offer', 'ask for a raise', 'salary negotiation playbook', 'negotiation scripts', 'salary negotiation tips', 'how to negotiate salary', 'counter offer email'],
  openGraph: {
    title: 'SalaryPrep — Stop Leaving Money on the Table',
    description: 'Personalized salary negotiation playbook with scripts, market data, and strategy. Ready in 10 minutes.',
    type: 'website',
    url: 'https://www.salaryprep.com',
    siteName: 'SalaryPrep',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SalaryPrep — Stop Leaving Money on the Table',
    description: 'Personalized salary negotiation playbook with scripts, market data, and strategy. Ready in 10 minutes.',
  },
  alternates: {
    canonical: 'https://www.salaryprep.com',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'SalaryPrep Negotiation Playbook',
  description: 'Personalized salary negotiation playbook with exact scripts, market data, and step-by-step strategy. Delivered as a PDF in under 10 minutes.',
  url: 'https://www.salaryprep.com',
  brand: {
    '@type': 'Brand',
    name: 'SalaryPrep',
  },
  offers: {
    '@type': 'Offer',
    price: '39.00',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much does SalaryPrep cost?',
      acceptedAnswer: { '@type': 'Answer', text: 'SalaryPrep playbooks cost $39 one-time. Use code FIRST30 for 30% off ($27.30). No subscription required.' },
    },
    {
      '@type': 'Question',
      name: 'How is SalaryPrep different from ChatGPT?',
      acceptedAnswer: { '@type': 'Answer', text: 'Unlike ChatGPT, SalaryPrep analyzes your specific offer, resume, and market data to create a personalized 10+ page PDF playbook with exact counter-offer numbers, word-for-word scripts, and company-specific negotiation intelligence.' },
    },
    {
      '@type': 'Question',
      name: 'How quickly do I get my salary negotiation playbook?',
      acceptedAnswer: { '@type': 'Answer', text: 'Your personalized playbook is delivered to your email in under 10 minutes, usually about 5 minutes.' },
    },
    {
      '@type': 'Question',
      name: 'Does SalaryPrep have a money-back guarantee?',
      acceptedAnswer: { '@type': 'Answer', text: 'Yes. 100% money-back guarantee within 7 days, no questions asked. You keep the playbook either way.' },
    },
    {
      '@type': 'Question',
      name: 'How is SalaryPrep different from a negotiation coach?',
      acceptedAnswer: { '@type': 'Answer', text: 'Negotiation coaches charge $1,250-$6,000 and take days to schedule. SalaryPrep delivers comparable personalized strategy with market data, scripts, and objection handling for $39 in under 10 minutes.' },
    },
  ],
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body>
        {children}
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
