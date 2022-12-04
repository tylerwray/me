import type * as shiki from "shiki";
import { getHighlighter } from "shiki";
import { visit } from "unist-util-visit";

/**
 * getHighlighter() is the most expensive step of Shiki. Instead of calling it on every page,
 * cache it here as much as possible. Make sure that your highlighters can be cached, state-free.
 * We make this async, so that multiple calls to parse markdown still share the same highlighter.
 */
const highlighterCacheAsync = new Map<string, Promise<shiki.Highlighter>>();

interface Config {
  theme: string;
  langs?: shiki.Lang[];
}

const remarkShiki = async ({ theme, langs = [] }: Config) => {
  const cacheID: string = theme;
  let highlighterAsync = highlighterCacheAsync.get(cacheID);
  if (!highlighterAsync) {
    highlighterAsync = getHighlighter({ theme }).then((hl) => {
      hl.setColorReplacements({
        "#000001": "var(--astro-code-color-text)",
        "#000002": "var(--astro-code-color-background)",
        "#000004": "var(--astro-code-token-constant)",
        "#000005": "var(--astro-code-token-string)",
        "#000006": "var(--astro-code-token-comment)",
        "#000007": "var(--astro-code-token-keyword)",
        "#000008": "var(--astro-code-token-parameter)",
        "#000009": "var(--astro-code-token-function)",
        "#000010": "var(--astro-code-token-string-expression)",
        "#000011": "var(--astro-code-token-punctuation)",
        "#000012": "var(--astro-code-token-link)",
      });
      return hl;
    });
    highlighterCacheAsync.set(cacheID, highlighterAsync);
  }
  const highlighter = await highlighterAsync;

  // NOTE: There may be a performance issue here for large sites that use `lang`.
  // Since this will be called on every page load. Unclear how to fix this.
  for (const lang of langs) {
    await highlighter.loadLanguage(lang);
  }

  return () => (tree: any) => {
    visit(tree, "code", (node, index, parent) => {
      let lang: string;

      if (typeof node.lang === "string") {
        const langExists = highlighter.getLoadedLanguages().includes(node.lang);
        if (langExists) {
          lang = node.lang;
        } else {
          // eslint-disable-next-line no-console
          console.warn(`The language "${node.lang}" doesn't exist, falling back to plaintext.`);
          lang = "plaintext";
        }
      } else {
        lang = "plaintext";
      }

      let html = highlighter!.codeToHtml(node.value, { lang });

      // Q: Couldn't these regexes match on a user's inputted code blocks?
      // A: Nope! All rendered HTML is properly escaped.
      // Ex. If a user typed `<span class="line"` into a code block,
      // It would become this before hitting our regexes:
      // &lt;span class=&quot;line&quot;

      // Replace "shiki" class naming with "astro".
      html = html.replace('<pre class="shiki"', `<pre class="astro-code"`);
      // Add "user-select: none;" for "+"/"-" diff symbols
      if (node.lang === "diff") {
        html = html.replace(
          /<span class="line"><span style="(.*?)">([\+|\-])/g,
          '<span class="line"><span style="$1"><span style="user-select: none;">$2</span>'
        );
      }
      // Handle code wrapping
      html = html.replace(/style="(.*?)"/, 'style="$1; overflow-x: auto;"');

      const title = node.frontmatter?.title
        ? [
            {
              type: "element",
              tagName: "div",
              data: {
                hProperties: { "data-remark-code-title": true },
              },
              children: [{ type: "text", value: node.frontmatter.title }],
            },
          ]
        : [];

      const codeSnippetWrapper = {
        type: "element",
        tagName: "div",
        data: {
          hName: "AutoCodeSnippet",
          hProperties: {
            class: "code-snippet",
          },
        },
        children: [...title, { type: "html", value: html }],
      };

      if (node.frontmatter.title) {
        console.log(codeSnippetWrapper);
      }

      parent.children.splice(index, 1, codeSnippetWrapper);

      if (node.frontmatter.title) {
        console.log(parent);
      }
    });
  };
};

export default remarkShiki;
