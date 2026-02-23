import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'Salary Negotiation for Women: Close the Pay Gap';

export default function Image() {
  return generateBlogOG({
    title: 'Salary Negotiation for Women: Close the Pay Gap With These Strategies',
    tag: 'Strategy',
  });
}
