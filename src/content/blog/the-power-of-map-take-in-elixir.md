---
title: The Power of Map.take/2 in Elixir
description: Elixir has some powerful utility functions build into the standard library. One of my favorites is Map.take/2. After working exclusively in elixir for 3 years now, I've been floored by the breadth of its standard library. Simply put, it's delightful.
tags:
  - elixir
publishedOn: 2021-04-06
imageSrc: ./images/disassembled-typewriter.jpg
imageAlt: Disassembled Typewriter
imageCreditName: Florian Klauer
imageCreditUrl: https://unsplash.com/@florianklauer
---

After working exclusively in elixir for 3 years now, I've been floored by the breadth of its standard library. Simply put, it's delightful.

I've developed a loving connection to certain utilities in the standard library; [`elixir__Enum.any?/2`](https://hexdocs.pm/elixir/Enum.html#any?/2), [`elixir__Map.pop/3`](https://hexdocs.pm/elixir/Map.html#pop/3), [`elixir__Enum.zip/1`](https://hexdocs.pm/elixir/Enum.html#zip/1) to name a few.
But there's one you may not have used before that has made me very happy over the years. [`elixir__Map.take/2`][map_take].

It's a simple little function that doesn't do much on the surface. [The documentation is fairly unassuming.][map_take]
But, I'll bet you can find a way to make your code more readable after seeing these examples.

## No more "maybe add" functions

Starting out in elixir I would commonly take some source map and put its values on another map conditionally. Usually, that condition would just be
whether or not the source map had the key. I would find myself writing these kinds of functions:

```elixir
def call do
  source = get_some_map()

  %{}
  |> maybe_add_foo()
  |> maybe_add_bar()
end

defp maybe_add_foo(map, %{foo: foo}) do
  Map.put(map, :foo, foo)
end

defp maybe_add_foo(map, _), do: map

defp maybe_add_bar(map, %{bar: bar}) do
  Map.put(map, :bar, bar)
end

defp maybe_add_bar(map, _), do: map
```

Now, there's nothing _wrong_ with the code above. But you could imagine that if you needed 2-3 more `maybe_add_*` functions, it
could get pretty unwieldy.

Using [`elixir__Map.take/2`][map_take] is so much simpler when you just need to check if a key exists.

```elixir
---
highlight: {4}
---

def call do
  source = get_some_map()

  Map.take(source, [:foo, :bar])
end
```

## Split a map

When doing data transformations I'll sometimes need to split a source map into 2 or more sub-maps. Without [`elixir__Map.take/2`][map_take] your code might look like:

```elixir
def call(args) do
  contact = split_contact_info(args)
  address = split_address_info(args)

  {contact, address}
end

defp split_contact_info(map) do
  Enum.reduce(map, %{}, fn
    {:phone, phone}, acc -> Map.put(acc, :phone, phone)
    {:email, email}, acc -> Map.put(acc, :email, email)
    _, acc -> acc
  end)
end

defp split_address_info(map) do
  Enum.reduce(map, %{}, fn
    {:line1, line1}, acc -> Map.put(acc, :line1, line1)
    {:line2, line2}, acc -> Map.put(acc, :line2, line2)
    {:city, city}, acc -> Map.put(acc, :city, city)
    {:state, state}, acc -> Map.put(acc, :state, state)
    {:postal_code, postal_code}, acc -> Map.put(acc, :postal_code, postal_code)
    {:country, country}, acc -> Map.put(acc, :country, country)
    _, acc -> acc
  end)
end
```

Again, using [`elixir__Map.take/2`][map_take] is so much simpler.

```elixir
---
highlight: {2-3}
---

def call(args) do
  contact = Map.take(args, [:phone, :email])
  address = Map.take(args, [:line1, :line2, :city, :state, :postal_code, :country])

  {contact, address}
end
```

## Argument/Options validation

Often I've found myself writing a function where I want to be ultra-defensive about what I allow to be passed in. When there's only a few
arguments, passing them positionally works well:

```elixir
def call(name, email) do
  # Process something with name and email
end
```

With a few more arguments, I'll pass a map to the function and use [`elixir__Map.take/2`][map_take] to only allow the values I want.
I've found this especially helpful when talking to external APIs.

Without [`elixir__Map.take/2`][map_take] the reader has to keep the context of a reduce loop in their head:

```elixir
def call(params) do
  params = allowed_params(params)

  # Process something with params now sanitized
end

def allowed_params(params) do
  Enum.reduce(map, %{}, fn
    {:name, name}, acc -> Map.put(acc, :name, name)
    {:email, email}, acc -> Map.put(acc, :email, email)
    {:phone, phone}, acc -> Map.put(acc, :phone, phone)
    {:country, country}, acc -> Map.put(acc, :country, country)
    {:message, message}, acc -> Map.put(acc, :message, message)
    _, acc -> acc
  end)
end
```

[`elixir__Map.take/2`][map_take] shines again with its readability. Making the code declarative like this removes overhead from the reader,
freeing their mind from the reduce loop logic.

```elixir
def call(params) do
  params = Map.take(params, [:name, :email, :phone, :country, :message])

  # Process something with params now sanitized
end
```

Hopefully, you can start to appreciate the readability that [`elixir__Map.take/2`][map_take] can provide. For me, it sparks a little joy
each time I use it because I know the code it's saving me from writing, documenting, and testing ❤️.

[map_take]: https://hexdocs.pm/elixir/Map.html#take/2
