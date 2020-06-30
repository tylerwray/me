---
title: How to Build an Ecommerce App with Phoenix LiveView
description: This tutorial takes you through building a real world ecommerce application with phoenix liveview. Integrating with Stripe, using tailwindcss, and showing live updates to users.
icon: elixir
tags:
  - elixir
  - phoenix
  - liveview
  - elixir
  - stripe
path: /blog/phoenix-live-view-ecommerce-app/
author: Tyler Wray
date: 2020-05-15
banner: images/hero.jpg
bannerDescription: World map with Currency
bannerCreditName: Christine Roy
bannerCreditUrl: https://unsplash.com/photos/ir5MHI6rPg0
isPublished: false
---

I've heard alot about [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) from co-workers and twitter,
so I wanted to actually build something with it to really test it out. At it's core, Phoenix LiveView is a framework for writing
real-time UI's in a declarative fashion, using a programming langauage loved by many; [Elixir](https://elixir-lang.org/).

We're going to build an ecommerce application powered by [Stripe](https://stripe.com) and Phoenix LiveView. Along the way learning
about the problems Phoenix LiveView solves, some basics of Stripe, cool tailwindcss features, and a bit about reactive programming,

This is going to be fun, let's dive in.

## Create a New Phoenix App

Use [this guide](https://hexdocs.pm/phoenix/installation.html#content) in the
phoenix docs to Elixir, Erlang, Phoneix, NodeJS, and PostgreSQL.
Thats alot, but trust me it's worth it 🥇.

> If you're running macOS, I highly recommend [Postgres.app](https://postgresapp.com/) to
> run postgres, and [Postico](https://eggerapps.at/postico/) as a nice GUI client.
> Both made by the same wonderful people, at [EggerApps](https://eggerapps.at/about.html) 😍.

Once you have everything setup, let's run this command to create our application.

```bash
mix phx.new amazin --live
```

Choose `yes` to install dependencies and follow the instructions to start the app.

Once running, let's open [`http://localhost:4000`](http://localhost:4000) to see
the phoenix welcome page 😎.

![Phoenix default page](./images/phoenix-default.png "Phoenix default page")

## Stripe Account Setup

We will need a stripe account to use for our application.

If you have one, login now because we will need our API keys coming up soon.
If you don't, go create one on the [registration page](https://dashboard.stripe.com/register).

## Install Dependencies

We're going to need two elixir dependencies for our application:

1. [stripity_stripe](https://github.com/code-corps/stripity_stripe): A client library
   for working with the stripe API.
2. [Money](https://hexdocs.pm/money/Money.html): A currency formatter.

Add them to your deps in `mix.exs`

```elixir
# mix.exs

def deps do
  [
    {:stripity_stripe, "~> 2.8.0"},
    {:money, "~> 1.4"}
  ]
end
```

Then run

```bash
mix deps.get
```

Next we need to setup [tailwindcss](https://tailwindcss.com/) to work with liveview.
I really like tailwind as a companion to liveview because of it's utility-first nature.
It makes it really easy to style our live views and components.

For now, just install these modules.

```bash
npm install --prefix assets postcss-loader tailwindcss
```

## Configuration

We need to add a couple pieces of configuration. We need to tell `stripity_stripe`
what our Stripe API key is. We need to tell our Money package which currency to
use as a default. And lastly we need to tell webpack how to include tailwindcss.
You can grab the Stripe API secret key from the
[stripe developer page](https://dashboard.stripe.com/apikeys) of your stripe account.
Take great care with this key, like the name says, it's secret 🤫

Once you have your API key, create a new file: `config/dev.secret.exs`.

Inside that `config/dev.secret.exs` file, you can now safely add the api key from stripe:

```elixir
# config/dev.secret.exs

use Mix.Config

config :stripity_stripe, api_key: "YOUR_SECRET_KEY"
```

> Don't forget to add `config/dev.secret.exs` to your `.gitignore`!

Then in our dev configuration we are going to load that secret file we just created.
Make sure to put this at the very bottom of `config/dev.exs`

```elixir
# config/dev.exs

import_config "dev.secret.exs"
```

Now in the main configuration file we are going to give our default currency. I'm using
USD, but you can use any currency you'd like. A full list can be
found [in the docs of Money](https://hexdocs.pm/money/Money.Currency.html#content).

```elixir
# config/config.exs

config :money, default_currency: :USD
```

Now for tailwindcss configuration. This is going to the be the most javascript
you write in this guide, I promise. We're using [`postcss-loader`](https://postcss.org/)
to load tailwind, so lets do that by creating a new file at `assets/postcss.config.js`
with the contents:

```javascript
// assets/postcss.config.js

module.exports = {
  plugins: [require("tailwindcss")],
}
```

Then add the `postcss-loader` to the css rule in `assets/webpack.config.js`

```git
# assets/webpack.config.js

{
  test: /\.[s]?css$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader",
+   "postcss-loader",
  ],
}
```

## Testing it all out

Now you should be able to start the app and communicate with stripe!
Let's test that out. Start an interactive session of your application with:

```bash
iex -S mix
```

Then inside iex, run:

```elixir
iex(1)> Stripe.Customer.list
```

and you should see something like:

```elixir
{:ok,
 %Stripe.List{
   data: [],
   has_more: false,
   object: "list",
   total_count: nil,
   url: "/v1/customers"
 }}
```

And with that we are all setup! Now the fun begins 😈

## Navbar

We are going to create our first simple live view;
A basic navbar with product cards, each showing a live inventory count.

First thing we need to do is setup our root layout properly. And that starts with
adding our nice navbar.

<div class="bg-gray-800">
  <img alt="Amazin log" title="Amazin logo" src="/amazin-logo.svg" />
</div>

Head over to `lib/amazin_web/templates/layout/root.html.leex` and replace the
contents of the `<body />` tag so it looks like this:

```html
<body>
  <nav class="bg-gray-800">
    <div class="px-4 flex items-center">
      <img class="mr-6" src="images/logo.svg" />
      <a href="/" class="px-3 py-2 rounded text-white bg-gray-900">PRODUCTS</a>
    </div>
  </nav>
  <%= @inner_content %>
</body>
```

## Generate a Live view

Now we are going to create a new live view using the built in generators
that come with phoenix. If you haven't seen anything like this before,
it may blow your mind.

```bash
mix phx.gen.live Store Product products \
      cost:integer \
      description:string \
      name:string \
      stock:integer \
      thumbnail:string \
      upc:string:unique
```

This creates a context called `Store`, with a schema called `Product`,
using a table called `products`, with the remaining arguments describing
the data of a `Product`.

> Feel free to explore those files it created and get familiar with them.
> We will be going in and making edits to some of them later.

The generator output shows us all the files it created, instructs us to make
some updates to our router, and run migrations. Let's do that really quick.

The command gave us alot of routes to add, but we're really only going to need these two.

```git
scope "/", AmazinWeb do
  pipe_through :browser

+  live "/products", ProductLive.Index, :index
+  live "/products/:id", ProductLive.Show, :show
end
```

Then run migrations:

```bash
mix ecto.migrate
```

Now you can open the `amazin_dev` database in postgres and see the `products` table with our schema!

Lastly, we need to make one small change to the `cost` field in
`lib/amazin/store/product.ex`.

```git
-    field :cost, :integer
+    field :cost, Money.Ecto.Amount.Type
```

Using the `Money.Ecto.Amount.Type` here, we get automatic currency formatting 🙌🏻.

## Custom products grid

Now we're going make things our own and use the awesome power of tailwindcss. First,
we need to get rid of the default phoenix styles so we can have more control over the UI.
Replace all of `assets/css/app.scss` with this:

```css
@import "../node_modules/nprogress/nprogress.css";

@tailwind base;

@tailwind components;

@tailwind utilities;
```

Small one, but remove `class="container"` from the `<main />` tag
in `lib/amazin_web/templates/layout/live.html.leex`, because it conflicts
with the tailwindcss `container` class. Now its time to make our product list prettier.  
Replace all of `lib/amazin_web/live/product_live/index.html.leex` with

```html
<div class="grid grid-cols-4 gap-12 p-12">
  <%= for product <- @products do %>
  <div class="flex flex-col bg-white border border-gray-400 shadow rounded-lg">
    <img
      class="flex-grow p-6 object-contain"
      src="<%= product.thumbnail %>"
      title="<%= product.name %>"
      alt="<%= product.name %>"
    />
    <div class="px-6 py-4 border-t border-gray-400">
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        <%= product.name %>
      </h3>
      <p class="text-sm text-gray-500">
        <%= product.description %>
      </p>
    </div>
    <div class="px-6 py-4 border-t border-gray-400 text-xl">
      <%= product.stock %> remaining
    </div>
    <div class="p-6 py-4 border-t border-gray-400 text-xl">
      <div class="flex flex-col items-left">
        <%= product.cost %>
        <button
          phx-click="add_to_cart"
          phx-value-upc="<%= product.upc %>"
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

Let's seed our DB with some better data. Let's add the following to `priv/repo/seeds.exs`

```elixir
alias Amazin.Repo
alias Amazin.Store.Product

Repo.insert!(%Product{
  cost: 1295,
  description: "Louisville Slugger premium pine bat.",
  name: "Baseball Bat",
  stock: 10,
  thumbnail: "https://tshop.r10s.com/f32/0d1/b97c/5c3b/a03f/784b/c58d/11e6e999130242ac110004.jpg",
  upc: "111111111111"
})

Repo.insert!(%Product{
  cost: 1295,
  description: "Nike made barcelona soccer ball.",
  name: "Soccer ball",
  stock: 9,
  thumbnail:
    "https://images-na.ssl-images-amazon.com/images/I/513hBIizJUL.jpg",
  upc: "222222222222"
})

Repo.insert!(%Product{
  cost: 8995,
  description: "Wilson made NFL edition ball.",
  name: "Football",
  stock: 8,
  thumbnail:
    "https://dks.scene7.com/is/image/GolfGalaxy/16WILUNFLGMBLLFFCFTB?qlt=70&wid=600&fmt=pjpeg",
  upc: "333333333333"
})

Repo.insert!(%Product{
  cost: 6995,
  description: "Spalding made NBA edition ball.",
  name: "Basketball",
  stock: 7,
  thumbnail:
    "https://s7d2.scene7.com/is/image/dkscdn/16SPLUNBRPLCGMBLLBKB",
  upc: "444444444444"
})
```

<br />

Then run

```bash
mix run priv/repo/seeds.exs
```

Finally, if you start up the server again and go to
[`http://localhost:4000/products`](http://localhost:4000/products),
you should see a wonderful little grid of all your products 🥰

![Nice Finished Grid](/images/pretty-grid.png)

## Live Updates

Now we want to make that "remaining" number update when users purchase an item
and we're going to use [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html) to do it.

When our live-view mounts, we want to subscribe our view to any stock changes.
Add a `Phonenix.PubSub` subscription to the mount function in `lib/amazin_web/live/product_live/index.ex`.

```git
+ alias Phoenix.PubSub

  @impl true
  def mount(_params, _session, socket) do
+   if connected?(socket), do: PubSub.subscribe(Amazin.PubSub, "product.purchased")
    {:ok, assign(socket, :products, fetch_products())}
  end
```

Then we're going to add a

```elixir
  @impl true
  def handle_event("add_to_cart", %{"id" => id}, socket) do
    old_cart = Map.get(socket.assigns, :cart, [])
    new_cart = old_cart ++ [id]
    {:noreply, assign(socket, :cart, new_cart)}
  end

  @impl true
  def handle_info({:purchaed, product_id}, socket) do
    products =
      Enum.map(
        socket.assigns.products,
        fn
          %{id: ^id} = p -> Map.put(p, :stock, p.stock - 1)
          p -> p
        end
      )

    {:noreply, assign(socket, :products, products)}
  end
```

### Accomplishments 🏆

- Setup a new phoenix live view app
- Setup tailwindcss for proper user in our phoenix app
- Setup a stripe account and made API calls with elixir
- Learned about phoenix generators
- Built our first live view
- Built some awesome UI tailwindcss

### Tech used 💻

- Elixir
- Phoenix Framework
- Postgres
- Tailwindcss
