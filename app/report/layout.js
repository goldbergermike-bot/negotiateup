export const metadata = {
  title: 'Free Salary Report | SalaryPrep',
  description:
    'Get a free salary report with verified compensation data for your company and role. Base salary, stock, bonus, and total comp — sourced from real data, not estimates.',
  openGraph: {
    title: 'Free Salary Report | SalaryPrep',
    description:
      'Download a free PDF salary report with verified compensation data. No signup required — just pick your company and role.',
    url: 'https://www.salaryprep.com/report',
    siteName: 'SalaryPrep',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Salary Report | SalaryPrep',
    description:
      'Get a free PDF salary report with verified compensation data for your company and role.',
  },
  alternates: {
    canonical: 'https://www.salaryprep.com/report',
  },
};

export default function ReportLayout({ children }) {
  return children;
}
