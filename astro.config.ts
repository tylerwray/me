import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import image from "@astrojs/image";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import { remarkReadingTime } from "./remark-reading-time.js";
import { codeSnippets } from "./integrations/code-snippets.js";

// https://astro.build/config
export default defineConfig({
  site: "https://tylerwray.me/",
  markdown: {
    syntaxHighlight: false,
  },
  integrations: [
    tailwind(),
    image({
      serviceEntryPoint: "@astrojs/image/sharp",
    }),
    sitemap(),
    codeSnippets(),
    mdx({
      remarkPlugins: [remarkReadingTime],
    }),
  ],
});
