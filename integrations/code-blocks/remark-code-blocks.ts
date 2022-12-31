import type * as shiki from "shiki";
import { getHighlighter } from "shiki";
import { visit } from "unist-util-visit";
import heexLanguageGrammar from './heex_syntax.json'

/**
 * getHighlighter() is the most expensive step of Shiki. Instead of calling it on every page,
 * cache it here as much as possible. Make sure that your highlighters can be cached, state-free.
 * We make this async, so that multiple calls to parse markdown still share the same highlighter.
 */
const highlighterCacheAsync = new Map<string, Promise<shiki.Highlighter>>();

const DARK_THEME = "github-dark";
const LIGHT_THEME = "github-light";

const remarkShiki = async () => {
  const themes = [LIGHT_THEME, DARK_THEME];
  const cacheID = themes.join("-");
  let highlighterAsync = highlighterCacheAsync.get(cacheID);
  if (!highlighterAsync) {
    highlighterAsync = getHighlighter({ themes }).then((hl) => {
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

  const heexLanguage = {
    id: "heex",
    scopeName: "source.heex",
    grammar: heexLanguageGrammar,
    aliases: ["heex"],
  };

  await highlighter.loadLanguage(heexLanguage as any);

  // TODO: It would be SICK to use react for this.
  return () => (tree: any) => {
    visit(tree, "inlineCode", (node, index, parent) => {
      let lang: string | null = null;

      const inlineCodeRegex = /(.+)__(.+)/;

      // Language is given to inline code blocks
      // with __ like so: node.value: "`jsx__<SomeComponent />`"
      if (inlineCodeRegex.test(node.value)) {
        const match = node.value.match(inlineCodeRegex);
        lang = match[1];
        // The inline code itself
        node.value = match[2];
      }

      if (lang === null) {
        // Halt highlighting if no lang is given
        return;
      }

      const langExists = highlighter.getLoadedLanguages().includes(lang as any);

      if (!langExists) {
        console.warn(
          `The language "${lang}" doesn't exist, halting syntax highlighting.`
        );
        return;
      }

      const darkBlockHtml = removePreTag(
        buildBlock({ theme: DARK_THEME, code: node.value, lang, highlighter })
      );
      const lightBlockHtml = removePreTag(
        buildBlock({ theme: LIGHT_THEME, code: node.value, lang, highlighter })
      );

      const darkBlockWrapper = {
        type: "element",
        tagName: "span",
        data: {
          hName: "span",
          hProperties: {
            class: "dark-theme-inline-code-block",
          },
        },
        children: [{ type: "html", value: darkBlockHtml }],
      };

      const lightBlockWrapper = {
        type: "element",
        tagName: "span",
        data: {
          hName: "span",
          hProperties: {
            class: "light-theme-inline-code-block",
          },
        },
        children: [{ type: "html", value: lightBlockHtml }],
      };

      const codeBlockWrapper = {
        type: "element",
        tagName: "span",
        data: {
          hName: "span",
          hProperties: {
            class: "inline-code-block",
          },
        },
        children: [darkBlockWrapper, lightBlockWrapper],
      };

      parent.children.splice(index, 1, codeBlockWrapper);
    });

    visit(tree, "code", (node, index, parent) => {
      let lang: string;

      if (typeof node.lang === "string") {
        const langExists = highlighter.getLoadedLanguages().includes(node.lang);
        if (langExists) {
          lang = node.lang;
        } else {
          console.warn(
            `The language "${node.lang}" doesn't exist, falling back to plaintext.`
          );
          lang = "plaintext";
        }
      } else {
        lang = "plaintext";
      }

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

      const copyButton = {
        type: "element",
        data: {
          hName: "button",
          hProperties: { class: "code-block-copy-button" },
        },
        children: [{ type: "text", value: "Copy" }],
      };

      const darkBlockHtml = buildBlock({
        theme: DARK_THEME,
        code: node.value,
        lang,
        highlighter,
      });
      const lightBlockHtml = buildBlock({
        theme: LIGHT_THEME,
        code: node.value,
        lang,
        highlighter,
      });

      const darkBlockWrapper = {
        type: "element",
        tagName: "div",
        data: {
          hName: "div",
          hProperties: {
            class: "dark-theme-code-block",
          },
        },
        children: [{ type: "html", value: darkBlockHtml }],
      };

      const lightBlockWrapper = {
        type: "element",
        tagName: "div",
        data: {
          hName: "div",
          hProperties: {
            class: "light-theme-code-block",
          },
        },
        children: [{ type: "html", value: lightBlockHtml }],
      };

      const codeBlockWrapper = {
        type: "element",
        tagName: "div",
        data: {
          hName: "div",
          hProperties: {
            class: "code-block",
          },
        },
        children: [...title, copyButton, darkBlockWrapper, lightBlockWrapper],
      };

      parent.children.splice(index, 1, codeBlockWrapper);
    });
  };
};

function buildBlock({
  theme,
  code,
  lang,
  highlighter,
}: {
  theme: shiki.Theme;
  code: string;
  lang: string;
  highlighter: shiki.Highlighter;
}): string {
  let html = highlighter.codeToHtml(code, { lang, theme });

  // Q: Couldn't these regexes match on a user's inputted code blocks?
  // A: Nope! All rendered HTML is properly escaped.
  // Ex. If a user typed `<span class="line"` into a code block,
  // It would become this before hitting our regexes:
  // &lt;span class=&quot;line&quot;

  // Replace "shiki" class naming with "astro".
  html = html.replace('<pre class="shiki"', `<pre class="astro-code"`);

  // Add "user-select: none;" for "+"/"-" diff symbols
  if (lang === "diff") {
    html = html.replace(
      /<span class="line"><span style="(.*?)">([\+|\-])/g,
      '<span class="line"><span style="$1"><span style="user-select: none;">$2</span>'
    );
  }

  // Handle code wrapping
  html = html.replace(/style="(.*?)"/, 'style="$1; overflow-x: auto;"');

  return html;
}

function removePreTag(html: string): string {
  const removePreTagRegex = /<pre.+?>(.+)<\/pre>/;
  return html.replace(removePreTagRegex, "$1");
}

export default remarkShiki;
