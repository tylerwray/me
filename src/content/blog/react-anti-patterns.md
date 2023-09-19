---
title: React Anti-Patterns
description: Am I using the right pattern? What will my coworkers think of this? Is this readable? Everyone asks themselves these questions at some point when learning something new. I've been working with React for 3 1/2 years now and these are some patterns that have come back to bite me.
tags:
  - react
publishedOn: 2019-02-20
imageSrc: ./images/tires.jpg
imageAlt: Tires stacked in Pattern
imageCreditName: Lane Smith
imageCreditUrl: https://unsplash.com/photos/wEsqjsjIDLs
---

- Am I using the right pattern?
- What will my coworkers think of this?
- Is this readable?

Everyone asks themselves these questions at some point when learning something new. I've been working with React for 3 1/2 years now and these are some patterns that have come back to bite me.

## TLDR;

You should watch out for code that you can't understand easily, write readable code.
Testable code is usually easier to read, so write tests! 🧪

> Shoutout to [react-testing-library](https://github.com/kentcdodds/react-testing-library)

## Inheritance 👨‍👧

I first started writing React after reading a book on design patterns, and the first chapter was on Inheritance.

!['Headfirst Design Patterns Book'](./images/headfirst-design-patterns.jpg "Headfirst Design Patterns")

> Great book, worth the read 👍🏼

The basics of inheritance are you have a class that can _inherit_ the behavior of another class. Similar to how we inherit traits from our parents.

One of my first challenges was I had two components that needed the same data fetching behavior. And what came next was some of the worst code I have EVER written. I broke the number one React rule, I made a component base class 🙈

It looked something like this:

```jsx
class Base extends React.Component {
  componentDidMount() {
    apiCall(this.props.type).then((data) => {
      this.setState({ data });
    });
  }

  render() {
    throw new Error("SHOULD NEVER GET HERE");
  }
}

class Widget extends Base {
  render() {
    if (!this.state.data) return null;

    return <div>{this.state.data.title}</div>;
  }
}
```

The idea was that `Widget` extends another component to save some code duplication.
Don't use the `extends` keyword to inherit other React components.
The funny thing is, [React has explicit warnings against this!](https://reactjs.org/docs/composition-vs-inheritance.html)
Read the docs people.

## Prop spreading 💔

I'm pretty sure everyone runs into this problem in React. I call it _Prop Madness_.
Here is an example:

```jsx
function Outer({ data, onHover, onClick, onSaveInner }) {
  return (
    <Inner
      title={data.title}
      date={data.date}
      isTesting={data.isTesting}
      text={data.text}
      actionButtonTitle={data.actionButtonTitle}
      onHover={onHover}
      onClick={onClick}
      onSaveInner={onSaveInner}
    />
  );
}

function Inner({ title, date, isTesting, onHover, onClick }) {
  // Do stuff ...
}
```

You can mask the problem like this:

```jsx
---
highlight: {4}
---

function Outer({ data, onHover, onClick, onSaveInner }) {
  return <Inner {...data} onHover={onHover} onClick={onClick} onSaveInner={onSaveInner} />;
}

function Inner({ title, date, isTesting, onHover, onClick }) {
  // Do stuff ...
}
```

Problem solved! Right?

**Nope.**

We haven't really solved it. Now any extra properties on the data object get passed
to the `jsx__<Inner />` component when they don't need to! And what happens when some of those props become optional? When the `jsx__<Inner />`
component wants to rename one of those props?

Also notice how the `jsx__<Outer />` component doesn't actually use any of the props, it just passes them along!

This approach couples the two components together, you may as well inline the `jsx__<Inner />` component inside the `jsx__<Outer />`

React created a built-in approach to solving this problem. It's called [Context](https://reactjs.org/docs/context.html).

Context can solve this problem quite nicely, and I recommend learning the API. However, if you use something like Redux, Apollo, Relay, MobX, or anything similar, keep in mind the next Anti-pattern.

## Smart and Dumb components 🎭

Too often I see code that is over-abstracted and split up into pieces that are too small. Not just with React either. Have you ever seen a generic `/utils` folder that holds all the business logic and each _"utility"_ is only used in one other place? It's misdirection (not abstraction), and it hurts code readability.

Our Prophet, Dan Abramov, recently made an addendum to his post on [Presentational vs Container Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0), stating that separation like this can be harmful when taken too seriously.

I live by the following mantra:

**A component is a component**

Simple right? The idea is that we don't need to separate concerns and make components focused on _styles_ 💅 or _data_ 📈. A component is a component, and that means it doesn't matter if it has _css_, or makes _api_ calls.
_Prop Madness_ can occur when trying to separate components by what they _do_ instead of what they _are_.

Don't over-abstract your components. Don't focus on [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) code _too_ much, and favor code readability over patterns and reuse.

My favorite quote about programming in general:

"_Make it work, Make it right, Make it fast_" - [Kent Beck](https://twitter.com/KentBeck?s=17)

## Too many files 🗂

People, It's **O.K.** to put more than one component in a single file. I'm not sure what started this trend, but I've seen projects where there is a file per component or even per function 😱.

Co-location is perfectly valid if you don't need to reuse the code elsewhere.

Take the following NavBar component for example:

```jsx
---
title: NavBar.js
highlight: {5-10,16-19}
---

import React from "react";
import axios from "axios";
import styled from "styled-components";

// Styled-components are my favorite 😊💅
const Title = styled.h1`
  background-color: #dc8b22;
  font-size: 1.5rem;
  text-decoration: underline;
`;

const Result = styled.div`
  border-bottom: 2px solid orange;
`;

// I also love Axios!
function apiCall(keyword) {
  return axios.get(`/api/search?query=${keyword}`);
}

export function NavBar() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState(null);

  function handleChange(event) {
    setKeyword(event.target.value);
  }

  function search(event) {
    event.preventDefault();

    apiCall(keyword).then((data) => {
      setResults(data.results);
    });
  }

  return (
    <header>
      <Title>Find things!</Title>
      <form onSubmit={search}>
        <input placeholder="Search" onChange={handleChange} />
      </form>
      {results.map((result) => (
        <Result key={result.id}>{result.value}</Result>
      ))}
    </header>
  );
}
```

> This code is completely arbitrary, and I'm leaving quite a bit out.

Notice how it combines styles, data loading, and regular markup? Especially notice how this file encapsulates all the logic around the NavBar search? We should optimize our code for readability. In most cases having 3 files open to understand how a nav bar gets rendered is not readable.

## Lastly... 🤔

_There are no anti-patterns!_

Yeah, kinda boring conclusion here. I think the reason I've come to love React is the un-opinionated stance it takes. Do what makes sense and follow good principles of programming.

- 🧪 Write tests
- ♻️ Always be refactoring
- 📚 Optimize for readability

React is doing something we have never seen before, it is outlasting the Javascript library lifecycle. I'm extremely Bullish on React and I can't wait to see where we take it the next 5 years 👍🏼
