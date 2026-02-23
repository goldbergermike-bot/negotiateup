import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'How to Get a Raise When Your Company Says No Budget';

export default function Image() {
  return generateBlogOG({
    title: 'How to Get a Raise When Your Company Says "No Budget"',
    tag: 'Raises',
  });
}
