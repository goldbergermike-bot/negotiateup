import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'How to Respond to a Lowball Job Offer';

export default function Image() {
  return generateBlogOG({
    title: 'How to Respond to a Lowball Job Offer (Without Burning the Bridge)',
    tag: 'Negotiation',
  });
}
