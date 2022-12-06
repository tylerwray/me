import type { AstroIntegration } from "astro";
import remarkCodeBlocks from "./remark-code-blocks";
import remarkCodeFrontmatter from "remark-code-frontmatter";

export function codeBlocks(): AstroIntegration {
  return {
    name: "code-blocks",
    hooks: {
      "astro:config:setup": async ({ updateConfig }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [remarkCodeFrontmatter, await remarkCodeBlocks()],
          },
        });
      },
    },
  };
}
