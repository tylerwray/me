---
title: Gatsby + MDX
description: Using MDX with Gatsby to render custom elements in .mdx files
tags:
  - gatsby
  - react
  - mdx
publishedOn: 2021-12-16
tutorial:
  slug: rich_md_code_blocks
  title: Gatsby + MDX
imageSrc: ./images/blocks.jpg
imageAlt: Architecture Blocks
imageCreditName: Desmond Marshall
imageCreditUrl: https://unsplash.com/@ddmarshall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
---

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
