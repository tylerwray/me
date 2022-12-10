---
title: Rich Markdown Code Blocks
description: I've recently spent a good amount of time (probably too much) customizing the code blocks on my blog here to my exact liking. There's much more I want to do, but I'm really proud of how they turned out and I want to share with you how I created them!
layout: ../../layouts/BlogLayout.astro
tags:
  - react
  - gatsby
  - mdx
publishedOn: 2021-12-16
image:
  src: /assets/images/blocks.jpg
  alt: Architecture Blocks
  creditName: Desmond Marshall
  creditUrl: https://unsplash.com/@ddmarshall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

I've recently spent a good amount of time (probably too much) customizing the code blocks on my blog here to my exact liking. There's much more I want to do, but I'm really proud of how they turned out and I want to share with you how I created them!

Its my humble opinion that good code blocks are some of the most beautiful pieces of user interface on the web.

When I think of a good dev blog or good dev docs; I think of beautiful, rich, elegant code blocks that show blocks of code in context with the post. Done well, code blocks can really enhance the experience of reading development content. Some of my favorite code blocks are on sites like
[Gatsby](gatsbyjs.com/), [Stripe](https://stripe.com/docs/js), and [Josh W Comeau's Blog](https://www.joshwcomeau.com).

## Markdown Code Blocks

Even _more_ beautiful to me are code blocks in markdown because you can take this basic syntax —

````
```js
function hi() {
  console.log("hello");
}
```
````

— and transform it into this beautiful and feature rich code block for your readers!

```js
function hi() {
  console.log("hello");
}
```

This is what makes Markdown so powerful! Writing minimal syntax, with intent, resulting in beautiful experiences.

## My Setup

I'm gunna show you how I was able to make these custom code blocks on my blog using [Gatsby](https://gatsbyjs.com/), [MDX](https://mdxjs.com/), and [prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer).

> In this post I'm going to assume you know the basics of React. Things like rendering components, props, state, hooks.

Though I'm using this specific stack, the pieces can be adapted to use various combonations of technologies such as —

- NextJS
- Tailwind CSS
- remark
- Styled-components
- highlight.js

## Gatsby + MDX

MDX is the engine that translates plain markdown into awesome web markup. MDX is properly known for allowing a new flavor of markdown which you can render JSX within! Hence the name MD(X). We'll not be using that feature today. Instead we'll focus on the markdown rendering capabilites of MDX.

Install MDX by running —

```shell
yarn add @mdx-js/react @mdx-js/mdx
```

MDX transforms tripple backtick's (` ``` `) into `<pre />` tags on our webpage. So we're going to do some setup to prepare Gatsby and MDX for customization of the `<pre />` tags that MDX renders. We do that by rendering our own [`jsx__<MDXProvider />`](https://www.gatsbyjs.com/docs/how-to/routing/customizing-components/) component in Gatsby.

I like to do this by creating a few encapsulated components. First of which is `jsx__<MDXProvider />`

```jsx
---
title: src/components/MDXProvider.js
highlight: {4,5}
---

import React from "react";
import { MDXProvider as BaseMDXProvider } from "@mdx-js/react";

// This is what we'll use later to customize our code blocks!
const components = {};

function MDXProvider({ children }) {
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>;
}

export default MDXProvider;
```

Then we create `jsx__<RootWrapper />` to use `jsx__<MDXProvider />` —

```jsx
---
title: src/components/RootWrapper.js
highlight: {5}
---

import React from "react";
import MDXProvider from "./MDXProvider";

function RootWrapper({ children }) {
  return <MDXProvider>{children}</MDXProvider>;
}

export default RootWrapper;
```

Finally, we need to modify `wrapRootElement` in both `gatsby-browser.js` and `gatsby-ssr.js` so that our entire app is wrapped with `jsx__<RootWrapper />` —

```jsx
---
title: gatsby-browser.js and gatsby-ssr.js
highlight: {4-6}
---

import React from "react";
import RootWrapper from "./src/components/RootWrapper";

export const wrapRootElement = ({ element }) => <RootWrapper>{element}</RootWrapper>;
```

Now we are setup to deeply customize the `<pre />` tags rendered by MDX!

## PrismJS and prism-react-renderer

[PrismJS](https://prismjs.com/) is a syntax highlighting library for code blocks on the web. It works by taking in code and wrapping the pieces of the code in HTML tags with semantic class names so we can style things like variables, function names, booleans, numbers, etc.

[prism-react-renderer](https://github.com/FormidableLabs/prism-react-renderer) wraps PrismJS and gives us control to render each element as we see fit! This is the power that gives us the ability to create such rich and beautiful code blocks.

Install `prism-react-render` by running —

```shell
yarn add prism-react-renderer
```

Now we're going to create our rich code block! Create a new component, `jsx__<CodeBlock />`, that looks like this —

```jsx
---
title: src/components/CodeBlock.js
---

import React, { useState } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import "./CodeBlock.css";

function CodeBlock({ children, lang = "markup" }) {
  return (
    <Highlight {...defaultProps} code={children.trim()} language={lang}>
      {({ class, style, tokens, getLineProps, getTokenProps }) => (
        <div class="code-wrapper">
          <div class="code-language-badge">{lang}</div>
          <pre class={`code-preformatted ${class}`} style={style}>
            <CopyButton codeString={codeString} />
            <code class="code-block">
              {tokens.map((line, i) => (
                <div
                  {...getLineProps({
                    line,
                    key: i,
                    class: "code-block-line-wrapper",
                  })}
                >
                  <div class="code-block-line-number">{i + 1}</div>
                  <div class="code-block-line">
                    {line.map((token, key) => (
                      <span {...getTokenProps({ token, key })} />
                    ))}
                  </div>
                </div>
              ))}
            </code>
          </pre>
        </div>
      )}
    </Highlight>
  );
}

function CopyButton({ codeString }) {
  const [isCopied, setIsCopied] = useState(false);

  function copyToClipboard(str) {
    const el = document.createElement("textarea");
    el.value = str;
    el.setAttribute("readonly", "");
    el.style.position = "absolute";
    el.style.left = "-9999px";
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  return (
    <button
      class="code-block-copy-button"
      onClick={() => {
        copyToClipboard(codeString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 3000);
      }}
    >
      {isCopied ? "Copied!" : "Copy"}
    </button>
  );
}
export default CodeBlock;
```

Let's pause and read through this code for a bit. There's a lot to unpack.

First off we have the `jsx__<CodeBlock />` component which does all the magic of rendering each code block. This is a very nested and complex component. However, this complexity allows us to customize each intricate detail because we control how each element is rendered with react.

In `jsx__<CodeBlock />` we have our `jsx__<Highlight />` component from `prism-react-renderer`. If you're curious about the inner workings here, refer to the `prism-react-renderer` [README](https://github.com/FormidableLabs/prism-react-renderer).

Then we have our `jsx__<CopyButton />` component which is placed within the code block allowing the user to copy our
code block which is very useful for blog posts like this one 😉.

Finally, here's the accompanying styles that make our code block beautiful —

```css
---
title: src/components/CodeBlock.css
---

.code-wrapper {
  position: relative;
}

.code-language-badge {
  position: absolute;
  left: 1.5rem;
  text-transform: uppercase;
  background-color: rgb(91, 33, 182);
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border-bottom-right-radius: 0.375rem;
  border-bottom-left-radius: 0.375rem;
}

.code-preformatted {
  overflow: scroll;
  font-size: 0.875rem;
  line-height: 1.25rem;
  border-radius: 0.25rem;
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
}

.code-block {
  display: inline-block;
}

.code-block-line-wrapper {
  position: relative;
  display: flex;
}

.code-block-line-number {
  position: sticky;
  display: inline-block;
  left: 0;
  text-align: right;
  padding-right: 0.75rem;
  background-color: rgb(244, 244, 245);
  user-select: none;
  width: 3rem;
}

.code-block-line {
  display: inline;
}

.code-block-copy-button {
  border-radius: 0.25rem;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
```

Revisiting our `jsx__<MDXProvider />` component, we're going to wire up our `jsx__<CodeBlock />` component to MDX when it renders `<pre />` tags.

```jsx
---
title: src/components/MDXProvider.js
highlight: {31-33}
---

import React from "react";
import { MDXProvider as BaseMDXProvider } from "@mdx-js/react";
import CodeBlock from "./CodeBlock";

function transformCode({ children, class, ...props }) {
  // Parse lang from class. i.e. class is "language-jsx"
  const lang = class && class.split("-")[1];

  return (
    <CodeBlock lang={lang} {...props}>
      {children}
    </CodeBlock>
  );
}

function getCodeChild(children) {
  const childrenArray = React.Children.toArray(children);
  if (childrenArray.length !== 1) return null;
  const [firstChild] = childrenArray;
  if (firstChild.props.mdxType !== "code") return null;
  return firstChild;
}

const Pre = ({ children }) => {
  // Try to render a rich code block, fallback to plain
  // <pre /> tag otherwise.
  const codeChild = getCodeChild(children);
  return codeChild ? transformCode(codeChild.props) : <pre>{children}</pre>;
};

const components = {
  pre: Pre,
};

function MDXProvider({ children }) {
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>;
}

export default MDXProvider;
```

And that's it! We've now got rich and beautiful code blocks on the page. The cool thing with this approach is our `jsx__<CodeBlock />` component is very extensible. You can add line highlighting, file names, titles, and more. Anything you can imagine!

For more fun like theming, language support, and line highlights; refer to the `prism-react-renderer` [README](https://github.com/FormidableLabs/prism-react-renderer).

## Bonus - Inline Code Blocks

A little bonus... have you noticed all the nicely formtted inline code blocks? Like this one: `jsx__<MDXProvider />`?

Well that's all done with `prism-react-renderer` and MDX as well!

Here's how.

Add an `inlineCode` option to the `components` in our `jsx__<MDXProvider />` —

```jsx
---
title: src/components/MDXProvider.js
highlight: {26-28}
---
import React from "react";
import { MDXProvider as BaseMDXProvider } from "@mdx-js/react";
import InlineCode from "./InlineCode";

// Simplified for brevity ...

const Code = ({ children }) => {
  if (!children) return null;

  let lang = null;
  let inlineCode = children;

  // We'll be using double underscores to set our language for
  // inline code blocks.
  const RE = /__/;

  if (RE.test(children)) {
    const match = children.split("__");
    lang = match[0];
    inlineCode = match[1];
  }

  return <InlineCode lang={lang}>{inlineCode}</InlineCode>;
};

const components = {
  inlineCode: Code,
};

function MDXProvider({ children }) {
  return <BaseMDXProvider components={components}>{children}</BaseMDXProvider>;
}

export default MDXProvider;
```

Then create your `jsx__<InlineCode />` component.

```jsx
---
title: src/components/InlineCode.js
---

import React from "react";
import Highlight, { defaultProps } from "prism-react-renderer";

function InlineCode({ lang, children }) {
  const theme = useColorModeValue({ dark: darkTheme, light: lightTheme });

  return (
    <Highlight {...defaultProps} code={children} language={lang} theme={theme}>
      {({ class, style, tokens, getLineProps, getTokenProps }) => (
        <code class={`inline-code ${class}`} style={style}>
          {tokens.map((line, i) => (
            <span {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </span>
          ))}
        </Code>
      )}
    </Highlight>
  );
}

export default InlineCode;
```

And finally the styles to make it pretty 😍

```css
---
title: src/components/InlineCode.css
---

.inline-code {
  font-size: 0.875rem;
  line-height: 1.25rem;
  white-space: nowrap;
  border-radius: 0.25rem;
  padding: 0.25rem 0.5rem;
}
```

There you have it! Now you can write blocks inline with single backticks like this —

```
`css__font-size: 1rem;`
```

— or this —

```
`jsx__<MDXProvider />`
```

which will render this `css__font-size: 1rem;` and this `jsx__<MDXProvider />`.

Hopefully you now have beautiful, rich, inline and multi-line code blocks. Drop a comment if this helped you out and send me a picture of your blocks on twitter [@wray_tw](https://twitter.com/wray_tw)!