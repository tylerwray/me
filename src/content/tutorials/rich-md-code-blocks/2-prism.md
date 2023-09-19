---
title: PrismJS
description: Using PrismJS and prism-react-renderer to pair nicely with MDX custom components
tags:
  - gatsby
  - react
  - mdx
publishedOn: 2021-12-16
tutorial:
  slug: rich_md_code_blocks
  title: PrismJS
imageSrc: ./images/blocks.jpg
imageAlt: Architecture Blocks
imageCreditName: Desmond Marshall
imageCreditUrl: https://unsplash.com/@ddmarshall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

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
