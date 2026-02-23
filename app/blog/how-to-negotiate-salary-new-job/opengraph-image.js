import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'How to Negotiate Salary on a New Job Offer';

export default function Image() {
  return generateBlogOG({
    title: 'How to Negotiate Salary on a New Job Offer',
    tag: 'Job Offers',
  });
}
