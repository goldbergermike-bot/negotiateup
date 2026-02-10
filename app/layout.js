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

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
