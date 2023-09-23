---
title: Sample Page
description: Sample Page
tags:
  - javascript
publishedOn: 2020-04-06
draft: true
imageSrc: ./images/star-wars.webp
imageAlt: Star wars
imageCreditName: Florian Klauer
imageCreditUrl: https://unsplash.com/@florianklauer
---

# Heading level 1

This is a sample post showing all the different markdown features.

Some paragraph with long text that I'm not sure why It has to be this long honestly. Sometimes I like to write in sentences and sometimes I like to write in really
long paragraphs. IDK why I keep doing this, but I just can't help it! I really should check my typing speeds cause IDK if I'm that fast anymore and I want to be faster.

## Heading level 2

> I am a blockquote! I have things to say and stuff to do. I will tell you all about what needs to happen. Oh look I can [link to things](https://google.com)!

### Heading level 3

Lists!

- [Links everywhere](https://example.com/links).
- I can use inline code `Array.prototype`.
- Nice.

#### Heading level 4

Did you know markdown can render stuff with plain html? This is a blue block.

<div class="bg-blue-500 w-12 h-12 my-12"></div>

##### Heading level 5

Images are a fun way to breath a little life into a post.

![star wars](https://static.wikia.nocookie.net/starwars/images/c/cc/Star-wars-logo-new-tall.jpg/revision/latest)

###### Heading level 6

This sample use [github flavored markdown](https://github.github.com/gfm/).

We can also use [link references].

[link references]: /url "title"

This paragraph is part of the preceding list item.

a. This list is nested and does not require explicit item
continuation.

- This paragraph is part of the preceding list item.

b. List item b.

---

## Code Blocks

```elixir
---
title: I am elixir code with a title.
---
defmodule Code do
  def i_am_code do
    IO.inspect("I am code!")
  end
end
```

```js
---
title: I am javascript code with a title.
---
function iAmCode() {
  console.log('I am code!')
}
```

```jsx
---
title: I am javascript react code with a title.
---
import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

```ts
---
title: I am typescript code with a title.
---
function hello(name: string): string {
  return `Hello, ${name}`;
}
```

```tsx
---
title: I am typescript react code with a title.
---
import { useState } from 'react'

interface Props {
  label: string;
}

function Counter({ label }: Props) {
  const [count, setCount] = useState<number>(0);

  return (
    <label>{label}</label>
    <button onClick={() => setCount(count + 1)}>{count}</button>
  );
}
```

```css
---
title: I am css code with a title.
---

div[data-highlighted] > div#twenty-four {
  margin: 0 autol;
}
```

## Inline code blocks

You can render plain inline code blocks or sytax highlighted inline code blocks.

```js
console.log("Hello there!");
```

- Plain — `plain-text`
- Javascript — `js__console.log("Hello there!")`
- JSX — `jsx__<SomeComponent with some="props" />`
- Typescript — `ts__interface Props {}`
- TSX — `tsx__function Component(props: {id: string}) {}`
- Elixir — `elixir__Map.take(%{}, [:key, :and, :values])`
- CSS — `css__font-size: 1rem;`
