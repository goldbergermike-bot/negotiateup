import QuizClient from './QuizClient';

export const metadata = {
  title: 'Am I Underpaid? Free Salary Quiz — SalaryPrep',
  description: 'Take this free 60-second quiz to compare your salary against market data. Find out if you\'re underpaid based on your role, experience, location, and industry.',
  keywords: ['salary quiz', 'am I underpaid', 'salary comparison', 'market salary', 'salary check', 'pay comparison'],
  openGraph: {
    title: 'Am I Underpaid? Free Salary Quiz — SalaryPrep',
    description: 'Compare your salary against market data in 60 seconds. Free, anonymous, no signup required.',
  },
  alternates: {
    canonical: 'https://www.salaryprep.com/quiz',
  },
};

export default function QuizPage() {
  return <QuizClient />;
}
