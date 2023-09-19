---
title: Rich Markdown Code Blocks
description: I've recently spent a good amount of time (probably too much) customizing the code blocks on my blog here to my exact liking. There's much more I want to do, but I'm really proud of how they turned out and I want to share with you how I created them!
tags:
  - react
  - gatsby
  - mdx
publishedOn: 2021-12-16
tutorial:
  slug: rich_md_code_blocks
  title: Introduction
  homePage: true
imageSrc: ./images/blocks.jpg
imageAlt: Architecture Blocks
imageCreditName: Desmond Marshall
imageCreditUrl: https://unsplash.com/@ddmarshall?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText
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
