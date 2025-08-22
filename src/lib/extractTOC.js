import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import { visit } from "unist-util-visit";

/**
 * Estrae la Table of Contents (TOC) dagli headings (#, ##, ##).
 * Usa rehype-slug per avere gli stessi id del rendering.
 */
export async function extractTOC(markdown) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug);

  const tree = processor.runSync(processor.parse(markdown));

  const toc = [];
  visit(tree, "element", (node) => {
    if (["h1", "h2", "h3"].includes(node.tagName) && node.properties?.id) {
      const text = node.children
        .filter((c) => c.type === "text")
        .map((c) => c.value)
        .join(" ");
      toc.push({
        level: parseInt(node.tagName.replace("h", ""), 10),
        text,
        anchor: node.properties.id,
      });
    }
  });

  return toc;
}
