---
title: Bonus - Inline Code Blocks
description: Extend our setup slightly to allow Inline Code Blocks
tags:
  - gatsby
  - react
  - mdx
publishedOn: 2021-12-16
tutorial:
  slug: rich_md_code_blocks
  title: Bonus - Inline Code Blocks
imageSrc: ./images/blocks.jpg
imageAlt: Architecture Blocks
imageCreditName: Desmond Marshall
imageCreditUrl: https://unsplash.com/@ddmarshall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

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
