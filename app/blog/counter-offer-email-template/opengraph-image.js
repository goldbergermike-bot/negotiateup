import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'Counter Offer Email Template: Exactly What to Write';

export default function Image() {
  return generateBlogOG({
    title: 'Counter Offer Email Template: Exactly What to Write',
    tag: 'Scripts & Templates',
  });
}
