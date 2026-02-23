import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'How to Negotiate Salary at Amazon, Google & Big Tech';

export default function Image() {
  return generateBlogOG({
    title: 'How to Negotiate Salary at Amazon, Google & Big Tech',
    tag: 'Big Tech',
  });
}
