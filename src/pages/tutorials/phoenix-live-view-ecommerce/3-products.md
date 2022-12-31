---
title: Products Page
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
  title: Products Page
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---

## Navbar

We are going to create our first simple live view;
A basic navbar with a products grid, each showing a live inventory count.

First thing we need to do is setup our root layout properly. And that starts with
adding our nice navbar.

In our `root.html.heex` file replace the contents of the `<body />` tag so it looks like this —

```heex
---
title: lib/amazin_web/templates/layout/root.html.heex
---

<body>
  <nav class="bg-gray-800">
    <div class="p-4 flex gap-4 justify-center items-center">
      <div class="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 30 30"
          class="w-8 h-8 text-red-400"
        >
          <path d="m0 0h30.78v30.78h-30.78z" opacity="0" />
          <path
            d="m25.8039 8.605575-3.629475-3.629475c-.720854-.72175246-1.6988234-1.12770198-2.7189-1.1286h-8.13105c-1.0200766.00089802-1.99804595.40684754-2.7189 1.1286l-3.629475 3.629475c-.72175246.72085405-1.12770198 1.6988234-1.1286 2.7189v11.760525c0 2.1249156 1.72258443 3.8475 3.8475 3.8475h15.39c2.1249156 0 3.8475-1.7225844 3.8475-3.8475v-11.760525c-.000898-1.0200766-.4068475-1.99804595-1.1286-2.7189zm-10.4139 11.914425c-2.8332208 0-5.13-2.2967792-5.13-5.13 0-.7083052.5741948-1.2825 1.2825-1.2825s1.2825.5741948 1.2825 1.2825c0 1.4166104 1.1483896 2.565 2.565 2.565s2.565-1.1483896 2.565-2.565c0-.7083052.5741948-1.2825 1.2825-1.2825s1.2825.5741948 1.2825 1.2825c0 2.8332208-2.2967792 5.13-5.13 5.13zm-7.169175-11.5425 2.193075-2.193075c.2457703-.234356.5710113-.36720092.910575-.371925h8.13105c.3395637.00472408.6648047.137569.910575.371925l2.193075 2.193075z"
          />
        </svg>
        <div class="text-white text-xl">amazin</div>
      </div>

      <a href="/products" class="px-3 py-2 rounded text-white bg-gray-900">PRODUCTS</a>
      <div class="grow"></div>
      <a href="/cart" class="px-3 py-2 rounded text-white bg-gray-900">CART</a>
    </div>
  </nav>
  <%= @inner_content %>
</body>
```

Once it's done, it should look like this —

![Application Navigation](/assets/images/amazin-navigation.png)

## Products Live View

Now we are going to create a new live view using the built in generators
that come with phoenix. If you haven't seen anything like this before,
it may blow your mind.

```bash
mix phx.gen.live Store Product products \
  amount:integer \
  description:string \
  name:string \
  stock:integer \
  stripe_product_id:string:unique \
  thumbnail:string
```

This creates a context called `Store` with a live-view called `Products` and a table called `products`.
The remaining arguments defining the schema of a `Product`.

The generator output shows us all the files it created, instructs us to make
some updates to our router, and run migrations. Let's do that really quick.

The command gave us alot of routes to add, but we're going to ignore those and define our routes like so —

```diff
---
title: lib/amazin_web/router.ex
---

scope "/", AmazinWeb do
  pipe_through :browser

   get "/", PageController, :index
+  live "/products", ProductLive.Index, :index
+  live "/products/:id", ProductLive.Show, :show
end
```

Next, we're gunna make a few small tweaks to the `Product` schema —

1. Change the `amount` field to use the `Money` type to give us nice currency formatting all through the app.
1. Add a default of `0` to the stock field.

```diff
---
title: lib/amazin/store/product.ex
---

defmodule Amazin.Store.Product do
  # ..
  import Ecto.Changeset

  schema "products" do
-   field :amount, :integer
+   field :amount, Money.Ecto.Amount.Type
    field :description, :string
    field :name, :string
-   field :stock, :integer
+   field :stock, :integer, default: 0
```

Then run migrations:

```bash
mix ecto.migrate
```

## Products Live View Grid

Now we're going make things our own and use the awesome power of tailwindcss.

Small one, but remove `class="container"` from the `<main />` tag in both our templates because it conflicts with the tailwindcss `container` class —

```diff
---
title: lib/amazin_web/templates/layout/live.html.heex
---
- <main class="container>
+ <main>
```

```diff
---
title: lib/amazin_web/templates/layout/app.html.heex
---
- <main class="container>
+ <main>
```

Now its time to make our product list prettier.  
Replace the home page with —

```heex
---
title: lib/amazin_web/live/product_live/index.html.heex
---
<div class="grid grid-cols-4 gap-12 p-12">
  <%= for product <- @products do %>
    <div class="flex flex-col bg-white border border-gray-400 shadow rounded-lg">
      <img
        class="grow p-6 object-contain"
        src={product.thumbnail}
        title={product.name}
        alt={product.name}
      />
      <div class="px-6 py-4 border-t border-gray-400">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          <%= product.name %>
        </h3>
        <p class="text-sm text-gray-500"><%= product.description %></p>
      </div>
      <div class="px-6 py-4 border-t border-gray-400 text-xl">
        <%= product.stock %> remaining
      </div>
      <div class="p-6 py-4 border-t border-gray-400 text-xl">
        <div class="flex flex-col items-left">
          <%= product.amount %>
          <button
            phx-click="add_to_cart"
            phx-value-id={product.id}
            class="focus:outline-none focus:shadow-outline text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  <% end %>
</div>
```

This renders a four column grid of product "cards" each with an image, name, description,
inventory, price, and an "Add to cart" button. It's entirely styled with tailwindcss. I love ❤️
the readability of functional CSS.

Finally, if you start up the server again and go to
[`http://localhost:4000/products`](http://localhost:4000/products),
you should see a bare page with your navbar.

![Empty Page](/assets/images/amazin-empty-page.png)

## LiveView UI Setup

We want the live-view to update itself when relevent events occur. Theres alot of ways we _could_ accomplish that; but turns
out phoenix ships with a really nice way out of the box: [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html)!

First we need to make a quick stop in our `Store` context to do a few things —

1. Setup events: Use `Phoenix.PubSub` to create a reactive UI so that our live-view will auto-update when we receive webhooks from Stripe.
1. Upsert product: This is going to allow our webhook events to be idempotent, which is very nice to have when dealing with Stripe.

```elixir
---
title: lib/amazin/store.ex
---

defmodule Amazin.Store do
  # ...

  @doc """
  Subscribes you to product events.

  ## Examples

      iex> subscribe_to_product_events()
      :ok

  """
  def subscribe_to_product_events do
    Phoenix.PubSub.subscribe(Amazin.PubSub, "products")
  end

  @doc """
  Updates or inserts a product using the stripe product ID as the upsert key.

  ## Examples

      iex> save_stripe_product(%Stripe.Product{id: "prod_HoQoDjBRhwDy1B"})
      {:ok, %Product{}}

  """
  def save_stripe_product(stripe_product) do
    case Stripe.Price.list(%{product: stripe_product.id}) do
      {:ok, %{data: stripe_prices}} ->
        result =
          %Product{}
          |> Product.changeset(format_stripe_product(stripe_product, stripe_prices))
          |> Repo.insert(
            on_conflict: {:replace, [:amount, :description, :name, :thumbnail]},
            conflict_target: :stripe_product_id
          )

        Phoenix.PubSub.broadcast(Amazin.PubSub, "products", :updated)

        result

      error ->
        error
    end
  end

  defp format_stripe_product(stripe_product, stripe_prices) do
    %{
      amount: first_amount(stripe_prices),
      description: stripe_product.description,
      name: stripe_product.name,
      stripe_product_id: stripe_product.id,
      thumbnail: List.first(stripe_product.images)
    }
  end

  defp first_amount([%Stripe.Price{unit_amount: amount} | _]), do: amount
  defp first_amount(_), do: 0
end
```

Important parts to notice here are the `Repo.insert/2` call with an `on_conflict` for upserts, the `Phoenix.PubSub.broadcast/3` call that broadcasts a generic "updated" event, and the `subscribe_to_product_events/0` function.

When our live-view mounts we want to subscribe our view to any product events. If we get notified of
any events via `Pheonix.PubSub.broadcast/2`, the `handle_info/2` function in the module is called.

Lets add the following to our product grid live view —

```diff
---
title: lib/amazin_web/live/product_live/index.ex
---

  @impl true
  def mount(_params, _session, socket) do
+   if connected?(socket), do: Store.subscribe_to_product_events()
    {:ok, assign(socket, :products, fetch_products())}
  end

+ @impl true
+ def handle_info(:updated, socket) do
+   {:noreply, assign(socket, :products, Store.list_products())}
+ end
```

## Stripe Webhooks

Stripe is the source of truth for our products and their prices. We are going to keep a copy of that data in our DB for performance. Our DB will be the source of truth for inventory. When stripe products
and prices change (or new ones are created) we want our live view to reflect those updates to the user immediately.
We setup the basis for that functionality in the previous section, and now we're going to test it's power using
webhooks from stripe.

> You can read more about stripe products and prices entities in their guide — https://stripe.com/docs/billing/prices-guide.

Following the [instructions](https://hexdocs.pm/stripity_stripe/Stripe.WebhookPlug.html#content) from our elixir-stripe package, we're going to setup our server to receieve webhooks from stripe.

Create a new module to handle webhooks from stripe. We will handle more events later by adding to this handler module —

```elixir
---
title: lib/amazin_web/stripe_webhook_handler.ex
---
defmodule AmazinWeb.StripeWebhookHandler do
  @behaviour Stripe.WebhookHandler

  alias Amazin.Store

  @impl true
  def handle_event(%Stripe.Event{type: "product.updated"} = event) do
    Store.save_stripe_product(event.data.object)
    :ok
  end

  @impl true
  def handle_event(%Stripe.Event{type: "product.created"} = event) do
    Store.save_stripe_product(event.data.object)
    :ok
  end

  # Return HTTP 200 for unhandled events
  @impl true
  def handle_event(_event), do: :ok
end
```

> In production it's better to have error handling and process the webhooks asynchronously. (See [stripe webhook best practices](https://stripe.com/docs/webhooks/best-practices) for more info). However; For the purposes
> of this tutorial we will just return `elixir__:ok` to tell stripe we received the webhook and process everything synchronously.

Next we update our endpoint to handle the routing and verification of webhooks using a provided plug from our elixir-stripe package —

```elixir
---
title: lib/amazin_web/endpoint.ex
---
plug Stripe.WebhookPlug,
  at: "/webhooks/stripe",
  handler: AmazinWeb.StripeWebhookHandler,
  secret: Application.compile_env(:amazin, :webhook_secret)

# Make sure this goes before `Plug.Parsers`
```

Remember our secrets file for configuration variables? We're going to update it now with our webhook secret.

Run the `stripe-cli` listener —

```bash
stripe listen --forward-to localhost:4000/webhooks/stripe
```

Then copy the webhook signing secret from the output. It should start with `whsec_`. Take that secret and update your config with it's value —

```diff
---
title: config/dev.secret.exs
---

import Config

config :stripity_stripe, api_key: "sk_test_123xxx"

config :amazin,
- webhook_secret: "YOUR_WEBHOOK_SECRET",
+ webhook_secret: "whsec_123xxx",
  stripe_public_key: "pk_test_123xxx"
```

## Add products

Next you'll want to start up the server with `mix phx.server` and navigate to [`http://localhost:4000/products`](http://localhost:4000/products).
You should see an empty page just like before.

Now open the stripe dashboard and go to your [test products page](https://dashboard.stripe.com/test/products).
Create a product with name, description, and image. Set a one-time price using the `Standard pricing` model.

Once you save that, you should magically see your products page update and display your product 🙌🏻
The cli should show that `product.created` event was sent and you should see a new record in your
database `products` table.

## Bonus - Backfill products

You may have products already in stripe and you don't want to wait for them to be updated via webhook, here's a simple backfill mix task which can be used to copy all stripe products into your DB.

Create a new file at `lib/mix/tasks/products_backfill.ex` —

```elixir
---
title: lib/mix/tasks/products_backfill.ex
---
defmodule Mix.Tasks.ProductsBackfill do
  @moduledoc """
  Sync all the products and their prices from stripe into your local DB.
  """

  @requirements ["app.start"]

  def run([]) do
    Stripe.Products.list()
  end
end
```
