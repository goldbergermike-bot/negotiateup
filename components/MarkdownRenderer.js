import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/**
 * Converts markdown to HTML string at build time.
 * Uses the unified pipeline: markdown → AST → HTML.
 * Content comes exclusively from our own research files (safe for dangerouslySetInnerHTML).
 */
function markdownToHtml(markdown) {
  const result = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .processSync(markdown);

  return String(result);
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const html = markdownToHtml(content);

  return (
    <div
      className="research-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
