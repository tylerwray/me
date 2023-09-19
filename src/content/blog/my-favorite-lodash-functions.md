---
title: My favorite Lodash Functions
description: Lodash is a fantastic library of JavaScript utilities that can really enhance your productivity and confidence as a developer. But with things being added to JavaScript every year, is Lodash still relevant?
tags:
  - javascript
publishedOn: 2020-04-06
imageSrc: ./images/blue-lego.jpg
imageAlt: Blue Lego
imageCreditName: Iker Urteaga
imageCreditUrl: https://unsplash.com/photos/TL5Vy1IM-uA
---

[Lodash](https://lodash.com) is a fantastic library of JavaScript utilities that
can really enhance your productivity and confidence as a developer. But with things
being added to JavaScript every year, is Lodash still relevant?

Sometimes it's easy to question the relevancy of Lodash with things like:

- [Optional Chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining).
- The nice `js__Array.prototype` functions like [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map), [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter), and [reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce).
- Nice [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object) functions like [Object.entries](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries), [Object.keys](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), and [Object.values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values).

Heck, there's even a [proposal](https://github.com/tc39/proposal-javascript-standard-library) for a JavaScript standard library that basically aims to deprecate lodash!

Lodash is still very helpful in everyday use. I've used these lodash utilities throughout my career and will probably continue to use them until TC39 adds their functionality to ECMAScript.

## Debounce ⛹🏻‍♂️

[`_.debounce`](https://lodash.com/docs#debounce)

Groups some number of repeated actions that occur during a time frame.

This is really nice for creating a search-as-you-type input that makes an api call to display the results.

## Throttle 🚙

[`_.throttle`](https://lodash.com/docs#throttle)

Similar to `_.debounce`, but instead of grouping repeated actions, it ensures that an action is only called once within a certain time frame. This is nice for performance reasons where we can get away with a delay to improve UX.

David Corbacho wrote [a great article](https://css-tricks.com/debouncing-throttling-explained-examples/) about the details of both `_.debounce` and `_.throttle`. I'd recommend giving it a read.

## Range 🚜

[`_.range`](https://lodash.com/docs#range)

Creates an array of consecutive integers, of a given length.

Almost every other language I've used has native ranges built in, and I miss them in JavaScript! This is a nice helper to create ranges that I use a TON.

## Memoize 💵

[`_.memoize`](https://lodash.com/docs#memoize)

[Memoization](https://en.wikipedia.org/wiki/Memoization) is a caching technique used for performance.

The basic idea is that given the same input over and over, a _memoized_ function will calculate the return value the first time, cache it, and return that same value instead of actually running the function each time.

I've used this when creating a search index for fast frontend searching with something like [fuse.js](https://fusejs.io/). With `_.memoize`, the search index is only calculated once for the set of items.

You _can_ implement your own memoization helper in vanilla JS, but there are some tricky edge cases lined out [in this article](https://www.sitepoint.com/implementing-memoization-in-javascript/), and lodash already has a battle tested one for us.

## Shuffle 🂡

[`_.shuffle`](https://lodash.com/docs#shuffle)

Really pretty simple. Takes an array, and returns a new array, shuffled! I've found this useful when I want a "random" list of items.

## IsEqual ✅

[`_.isEqual`](https://lodash.com/docs#isEqual)

This is very nice to see if two objects have the same values. It deeply checks each object to determine if they have the same values.

I've used this the most to check if an array of items has changed when saving forms.

## Pick ⛏

[`_.pick`](https://lodash.com/docs#pick)

Pick only a subset of keys from an object. This is really handy when ensuring that only certain values are on an object before sending through an operation.

I've used this mostly as a safety layer before making api requests to make sure that things aren't accidentally getting sent that shouldn't.

## Repeat 🔁

[`_.repeat`](https://lodash.com/docs#repeat)

Repeat a string `n` times.

This is nice when you need a dynamic length string of special characters.

I've used this when building a CLI with node and I wanted a box of `*` around a word.

## Truncate ✂

[`_.truncate`](https://lodash.com/docs#truncate)

Truncate a string when it is longer than a certain number of characters.

I've used this most when I want uniform items in a list, and have a description of some kind for each item. I'll truncate the description so that it only ever wraps 2 lines at most

## Capitalize 🏛

[`_.capitalize`](https://lodash.com/docs#capitalize)

Capitalize a word for readability. This is really nice because it includes a ton of edge cases for text formatting.

---

One honorable mention utility is [`_.get`](https://lodash.com/docs#get). I've used `_.get()` more that any of the utilites above, but recently
Create React App v3 includes support for Optional Chaining, so I don't use it anymore. 🤷🏻‍♂️

And that's it! Let me know if I missed a one that you find useful on [Twitter](https://twitter.com/wray_tw).
