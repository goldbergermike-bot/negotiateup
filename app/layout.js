import './globals.css';

export const metadata = {
  title: 'NegotiateUp — Your Personalized Salary Negotiation Playbook',
  description: 'Get a personalized salary negotiation playbook with exact scripts, market data, and strategy. Works for new job offers and raise requests. Ready in 10 minutes.',
  openGraph: {
    title: 'NegotiateUp — Stop Leaving Money on the Table',
    description: 'Personalized salary negotiation playbook with scripts, market data, and strategy. Ready in 10 minutes.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
