import { generateBlogOG, size, contentType } from '../../../lib/og-blog';

export const runtime = 'edge';
export { size, contentType };
export const alt = 'How to Ask for a Raise: The Complete Playbook';

export default function Image() {
  return generateBlogOG({
    title: 'How to Ask for a Raise: The Complete Playbook',
    tag: 'Raises',
  });
}
