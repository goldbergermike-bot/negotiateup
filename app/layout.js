import './globals.css';
import Script from 'next/script';

export const metadata = {
  title: 'SalaryPrep — Your Personalized Salary Negotiation Playbook',
  description: 'Get a personalized salary negotiation playbook with exact scripts, market data, and strategy. Works for new job offers and raise requests. Ready in 10 minutes.',
  openGraph: {
    title: 'SalaryPrep — Stop Leaving Money on the Table',
    description: 'Personalized salary negotiation playbook with scripts, market data, and strategy. Ready in 10 minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
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
