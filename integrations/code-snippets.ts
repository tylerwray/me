import type { AstroIntegration } from "astro";
import remarkShiki from "../remark-shiki";
import remarkCodeFrontmatter from "remark-code-frontmatter";

// TODO: Does this have to be an integration?
export function codeSnippets(): AstroIntegration {
  return {
    name: "code-snippets",
    hooks: {
      "astro:config:setup": async ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkCodeFrontmatter, await remarkShiki()],
          },
        });
      },
    },
  };
}
