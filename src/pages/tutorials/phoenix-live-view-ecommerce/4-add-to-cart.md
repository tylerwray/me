---
title: Add to cart
description: Some description about Stripe Setup
layout: ../../../layouts/TutorialLayout.astro
tags:
  - stripe
  - elixir
  - phoenix live view
  - tailwind
publishedOn: 2022-12-07
draft: true
tutorial: 
  slug: live_view_ecommerce
  title: Add to Cart
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---
Earlier we added our HTML for our products page, and you may have noticed on our `Add to cart` button, we included
a `phx-click="add_to_cart"` attribute. This sets us up to handle that button click in elixir, and manage a cart full of products!

Using the awesome powers of phoenix generators again, we're going to create a table
called `cart_items` with a `product_id` column that is a foreign key to our `products` table.

```bash
mix phx.gen.live Store CartItem cart_items product_id:references:products
```

The command again gives us lots of routes to add, but we only need this one for now:

```diff
scope "/", AmazinWeb do
  pipe_through :browser

  live "/products", ProductLive.Index, :index
  live "/products/:id", ProductLive.Show, :show
+ live "/cart_items", CartItemLive.Index, :index
end
```

Remember to migrate the DB to keep it up-to-date:

```bash
mix ecto.migrate
```

Lastly, we have to make a small change to the `CartItem` schema, adding the `product_id` foreign key to the cast fields.
(I'm not sure why phoenix generators don't include this?)

```diff
defmodule Amazin.Store.CartItem do
  # ...

  @doc false
  def changeset(cart_item, attrs) do
    cart_item
-   |> cast(attrs, [])
-   |> validate_required([])
+   |> cast(attrs, [:product_id])
+   |> validate_required([:product_id])
  end
end
```

Once we do this 👆 we can add the following to our `lib/amazin_web/live/product_live/index.ex` live-view module to handle `Add to cart` clicks.

```elixir
---
title: lib/amazin_web/live/product_live/index.ex
---

defmodule AmazinWeb.ProductLive.Index do
  # ...
  @impl true
  def handle_event("add_to_cart", %{"id" => id}, socket) do
    Store.create_cart_item(%{product_id: id})
    {:noreply, socket}
  end
end
```

We pattern match on the name of the `phx-click` attribute, and we receive a map of any `phx-value-*` attributes.
On our button, we also added a `phx-value-id` attribute which is set to each respective product id.

Now if we go click the `Add to cart` button, we should see `cart_items` records appearing in our database!
