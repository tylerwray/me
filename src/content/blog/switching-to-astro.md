---
title: Rebuilding this blog with Astro
description: I recently rebuilt this blog with Astro! Explore why I moved away from Gatsby, what I like about astro, and why I decided to make the switch.
tags:
  - astro
  - javascript
publishedOn: 2023-12-04
draft: true
imageSrc: ./images/astro.png
imageAlt: Astro logo
imageCreditName: Astro
imageCreditUrl: https://astro.build
---

For years [Gatsby](https://www.gatsbyjs.com/) has been my default framework for building applications. Gatsby was my tool I'd reach for when I needed a complete application starting point
that was performant and simple. Over time however, I found maintenence of my Gatsby applications difficult. When I would revisit a project I felt like I needed to re-learn Gatsby. GraphQL within
Gatsby began to feel like an unnecessary burden in each project.

About a year ago I wanted to do something special with my blog (this site). I wanted to build a [multi-stage tutorial](https://tylerwray.me/tutorials/phoenix-live-view-ecommerce/) that people
could follow piece-by-piece to understand a new technology. I dug into my blog, then written in Gatsby, and felt the same pain of re-learning I had on other projects. I needed something new.

Prior to this at work I had built a bespoke internal engineering documentation application and during that process a co-worker had mentioned we should use [Astro](https://astro.build/). At
the time it was so new (prior 1.0) and the concepts were so unfamiliar we decided against it and used Gatsby instead. When I was looking for something new for my blog, that co-worker's suggestion
stuck in my brain and I decided to checkout Astro further. Astro had just released 1.0 and as I dug into it's principles and tech I was blown away. Islands architecture, content first, loads of
official plugins for all the tech I used. Astro felt special, I decided to give it a shot.

Conversion to Astro was very quick due to first party JSX and markdown support. Astro's Island Architecture helped me ship a small but complex piece of my blog using React, while keeping everythign else
100% static. I had used a few Gatsby specific plugins which took time to convert. The most complext being code blocks (check out my [tutorial](https://tylerwray.me/tutorials/rich-md-code-blocks/) for more details).
I ended up using [Shiki](https://shiki.matsu.io/) instead and have loved the results.

After converting the site to Astro, deployment was very easy because I was just serving static content! My site ended up being ~20% faster because the content was truly static and didn't require React runtime to be sent
to the browser due to Astro's glorious Islands Architecture. I thought I needed React everywhere so my site was all MDX pages. Turns out I wasn't really using it! Astro components and plain markdown was plenty for what
I needed, and MDX is actually way slower which lead to a bad development experience.

The best part of switching to Astro is the simplicity. I can choose where I introduce the complexity. No need for GraphQL, just use the file system. All my plugins for react, tailwind, and sitemap generation are maintained
by the Astro core team. Updates to astro itself and the official plugins have been seamless! I'm already on Astro 4.0 and each upgrade was very easy with clear migration paths. Not to mention all the other goodies like 
first class Typescript support, content schemas, built markdown support with frontmatter, and so much more.

I was a bit naive to use Gatsby for so many things apps the past. Astro is not replacing Gastby as my default app builder, but it is now my default framework for content rich sites going forward.

