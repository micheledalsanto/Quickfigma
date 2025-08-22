import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

export default function MarkdownPage({ markdown }) {
  if (!markdown) return <div className="text-gray-500">Caricamento…</div>;
  
  // Rimuovi la prima riga se è un titolo ## (verrà mostrato nell'header)
  const processedMarkdown = markdown.replace(/^##\s+.+$/m, '').trim();
  
  return (
    <div className="prose prose-blue max-w-none font-inter markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]} // niente rehype-autolink-headings
        components={{
          table: props => (
            <table className="table-auto w-full border-collapse" {...props} />
          ),
          th: props => (
            <th className="border px-3 py-2 text-left bg-gray-50" {...props} />
          ),
          td: props => (
            <td className="border px-3 py-2 align-top" {...props} />
          ),
          code({ inline, className, children, ...rest }) {
            if (inline) {
              return (
                <code
                  className="px-1 py-0.5 rounded bg-gray-100 text-pink-600"
                  {...rest}
                >
                  {children}
                </code>
              );
            }
            return (
              <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg overflow-auto">
                <code className={className} {...rest}>
                  {children}
                </code>
              </pre>
            );
          }
        }}
      >
        {processedMarkdown}
      </ReactMarkdown>
    </div>
  );
}
