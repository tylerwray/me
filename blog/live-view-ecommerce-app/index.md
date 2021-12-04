---
title: Build an eCommerce App with Phoenix LiveView
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
date: 2021-05-15
banner: images/hero.jpg
bannerDescription: World map with Currency
bannerCreditName: Christine Roy
bannerCreditUrl: https://unsplash.com/photos/ir5MHI6rPg0
isPublished: false
---

I've heard alot about [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) from co-workers and twitter,
so I wanted to actually build something to test it's merit. At it's core, Phoenix LiveView is a framework for writing
real-time web UI's in a declarative fashion, using a programming langauage loved by many; [Elixir](https://elixir-lang.org/).

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

Once running, let's open [`http://localhost:4000/products`](http://localhost:4000/products) to see
the phoenix welcome page 😎.

![Phoenix default page](./images/phoenix-default.png "Phoenix default page")

## Stripe Account Setup

We will need a stripe account to use for our application.

If you have one, login now because we will need our API keys coming up soon.
If you don't, go create one on the [registration page](https://dashboard.stripe.com/register).

To test it out, let's install the stripe CLI which we'll use to receieve webhooks from stripe later.
[Follow the directions here to install and login](https://stripe.com/docs/stripe-cli)

To test that you have it installed properly, try and look at the logs for your account:

```bash
stripe logs tail
```

You should see a `Ready!` message if you correctly installed the CLI and logged into your stripe account.
`Ctrl+c` out of that command, and lets continue 👍🏼

## Install Dependencies

We're going to need three elixir dependencies for our application:

1. [elixir_uuid](https://hexdocs.pm/elixir_uuid/readme.html): Will help us generate idempotency keys for stripe.
1. [stripity_stripe](https://github.com/code-corps/stripity_stripe): A client library
   for working with the stripe API.
1. [Money](https://hexdocs.pm/money/Money.html): A currency formatter.

Add them to your deps in `mix.exs`

```elixir
# mix.exs

def deps do
  [
    {:elixir_uuid, "~> 1.2"},
    {:stripity_stripe, "~> 2.9.0"},
    {:money, "~> 1.8"}
  ]
end
```

Then run

```bash
mix deps.get
```

Next we need to setup [tailwindcss](https://tailwindcss.com/) to work with liveview.
I really like tailwind as a companion to liveview because of it's composable nature.
It makes it really easy to style our live views.

For now, just install these modules.

```bash
npm install --prefix assets postcss postcss-loader tailwindcss
```

## Configuration

This part is a bit boring... but the payoff is worth it 🤞🏻 We need to add a couple pieces of configuration.

1. We need to tell `stripity_stripe` what our Stripe API key is.
1. We need to tell our Money package which currency to use by default.
1. Lastly, we need to tell webpack how to include tailwindcss.

You can grab the Stripe API public and secret keys from the
[stripe developer page](https://dashboard.stripe.com/apikeys) of your stripe account.
Take great care with the secret key, like the name says, it's secret 🤫

Once you have your API keys, create a new file: `config/dev.secret.exs`.

Inside that `config/dev.secret.exs` file, you can now safely add the keys from stripe:

```elixir
# config/dev.secret.exs

use Mix.Config

config :stripity_stripe, api_key: "YOUR_SECRET_KEY"

config :amazin,
  webhook_secret: "YOUR_WEBHOOK_SECRET",
  stripe_public_key: "YOUR_PUBLIC_KEY"
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

And with that, we are all set up! Now the fun begins 😈

## Products Page

We are going to create our first simple live view;
A basic navbar with a products grid, each showing a live inventory count.

First thing we need to do is setup our root layout properly. And that starts with
adding our nice navbar.

<div class="bg-gray-800">
  <img alt="Amazin logo" title="Amazin logo" src="/amazin-logo.svg" />
</div>

Head over to `lib/amazin_web/templates/layout/root.html.leex` and replace the
contents of the `<body />` tag so it looks like this:

```html
<body>
  <nav class="bg-gray-800">
    <div class="px-4 flex items-center">
      <img class="mr-6" src="https://tylerwray.me/amazin-logo.svg" />
      <a href="/" class="px-3 py-2 rounded text-white bg-gray-900">PRODUCTS</a>
      <div class="flex-grow"></div>
      <a href="/cart" class="px-3 py-2 rounded text-white bg-gray-900">CART</a>
    </div>
  </nav>
  <%= @inner_content %>
</body>
```

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

The command gave us alot of routes to add, but we're really only going to need these two.

```git
scope "/", AmazinWeb do
  pipe_through :browser

+  live "/products", ProductLive.Index, :index
+  live "/products/:id", ProductLive.Show, :show
end
```

Next, we're gunna make one small tweak to the `Product` schema. Change the `amount` field to use the `Money` type to give us nice currency formatting all through the app:

```git
defmodule Amazin.Store.Product do
  # ..
  import Ecto.Changeset

  schema "products" do
-   field :amount, :integer
+   field :amount, Money.Ecto.Amount.Type
    field :description, :string
    field :name, :string
    field :stock, :integer
```

Then run migrations:

```bash
mix ecto.migrate
```

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
with the tailwindcss `container` class.

Now its time to make our product list prettier.  
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
        <%= product.amount %>
        <button
          phx-click="add_to_cart"
          phx-value-id="<%= product.id %>"
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

![Empty Page](./images/empty-page.png)

Now let's fill our page with products.

## Live Updates

We want the live-view to update itself when relevent events occur. Theres alot of ways we _could_ accomplish that; but turns
out phoneix ships with a really nice way out of the box: [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html)!

First, when our live-view mounts we want to subscribe our view to any product events. If we get notified of
any events via `Pheonix.PubSub.broadcast/2`, the `handle_info/2` function in the module is called.

Lets add these things to our view at `lib/amazin_web/live/product_live/index.ex`:

```git
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

And with that, we have a completely reactive user-interface! Let's test it's power in this next section.

## Stripe Webhooks Setup

Stripe is the source of truth for our products and their prices. When those products
and prices change (or new ones are created) we want our live view to reflect those updates to the user immediately.
We setup the basis for that functionality in the previous section, and now we're going to test it's power using
webhooks from stripe.

Stripe webhooks will give us this ability. Notice that we haven't created any products to display yet.
Setting up webhooks is the first step on that path 💪

First, create a webhook route for stripe to notify our webserver. (We'll worry about creating that `WebhookController` module later)

```elixir
# lib/amazin_web/router.ex
scope "/", AmazinWeb do
  post "/webhooks", WebhookController, :index
end
```

Then we need to parse our webhook bodies and verify that the webhook is actually coming from stripe.
To do that, we are going to create a [plug parser](https://hexdocs.pm/plug/Plug.Parsers.html) and use some nice utilites from `stripity_stripe`.

```elixir
# lib/amazin_web/parsers/webhook_parser.ex

defmodule AmazinWeb.WebhookParser do
  @moduledoc """
  Verify and parse webhooks from stripe.
  """
  require Logger
  import Plug.Conn

  @behaviour Plug.Parsers

  @impl true
  def init(opts), do: opts

  @impl true
  def parse(%{request_path: "/webhooks"} = conn, "application", "json", _headers, opts) do
    {:ok, payload, conn} = read_body(conn, opts)

    signature =
      conn
      |> get_req_header("stripe-signature")
      |> List.first()

    secret = Application.get_env(:amazin, :webhook_secret)

    case Stripe.Webhook.construct_event(payload, signature, secret) do
      {:ok, %Stripe.Event{} = event} ->
        {:ok, %{event: event}, conn}

      {:error, reason} ->
        Logger.error(
          "Could not verify stripe webhook. Reason: #{inspect(reason)}"
        )

        raise Plug.BadRequestError
    end
  end

  def parse(conn, _type, _subtype, _headers, _opts) do
    {:next, conn}
  end
end
```

Breaking down the parser a bit; A plug parser in elixir is responsible for "parsing" the raw
request body into an understandable elixir data structure.
Plug has some [built in parsers](https://hexdocs.pm/plug/Plug.Parsers.html#module-built-in-parsers)
that are very useful, and get used by phoneix out the box. In this custom `webhook_parser` we are
validating that the webhook came from stripe, and converting a raw request body into a struct using `stripity_stripe`.

Next, make sure to use that parser in our server by updating the `Plug.Parsers` option in our app.

```git
# lib/amazin_web/endpoint.ex

plug Plug.Parsers,
+  parsers: [AmazinWeb.WebhookParser, :urlencoded, :multipart, :json],
   pass: ["*/*"],
   json_decoder: Phoenix.json_library()
```

Now that we've got the basics setup to handle incoming webhooks, let's go implement a few webhook events in our app!

## Handle Webhook Events

First we need to make a quick stop in our `Store` context to set us up for later.

1. Upsert product: This is going to allow our webhook events to be idempotent, which is very nice to have when dealing with Stripe.
1. Setup events: Use `Phoenix.PubSub` to create a reactive UI so that our live-view will auto-update when we receive webhooks from Stripe.

Notice the `Repo.insert` with an `on_conflict` for upserts, the `Phoenix.PubSub.broadcast/3` call that broadcasts a generic "updated" event, and the `subscribe_to_product_events/0` function.

```elixir
# lib/amazin/store.ex

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
  Updates or inserts a product using the `stripe_product_id`
  as the idempotency key.

  ## Examples

      iex> update_or_insert_product(%{stripe_product_id: "prod_HoQoDjBRhwDy1B"})
      {:ok, %Product{}}

  """
  def insert_or_update_product(attrs) do
    result =
      attrs
      |> Product.changeset()
      |> Repo.insert(on_conflict: :replace_all, conflict_target: :stripe_product_id)

    Phoenix.PubSub.broadcast(Amazin.PubSub, "products", :updated)
    result
  end
end
```

Remember how we created the `/webhook` route earlier and pointed it to a `WebhookController` module? Now we will create that controller to events from stripe.

```elixir
# lib/amazin_web/controllers/webhook_controller.ex

defmodule AmazinWeb.WebhookController do
  use AmazinWeb, :controller
  require Logger
  import Plug.Conn
  alias Amazin.Store

  def index(conn, %{event: %Stripe.Event{type: type, data: %{object: object}}}) do
    case process(type, object) do
      {:ok, _} ->
        send_resp(conn, :accepted, "")

      {:error, reason} ->
        send_resp(
          conn,
          :internal_server_error,
          "Failed to handle event with type #{type}. Reason: #{inspect(reason)}"
        )
    end
  end

  defp process(event_type, %Stripe.Product{} = product)
       when event_type in ["product.created", "product.updated"] do
    with {:ok, %{data: prices}} <- Stripe.Price.list(%{product: product.id}) do
      product
      |> format(prices)
      |> Store.insert_or_update_product()
    end
  end

  defp process(_, _), do: {:ok, :event_not_implemented}

  defp format(
         %Stripe.Product{
           description: description,
           id: id,
           images: images,
           name: name
         },
         prices
       ) do
    %{
      amount: first_amount(prices),
      description: description,
      name: name,
      stock: 0,
      stripe_product_id: id,
      thumbnail: List.first(images)
    }
  end

  defp first_amount([%Stripe.Price{unit_amount: amount} | _]), do: amount
  defp first_amount(_), do: 0
end
```

This controller receives webhook events and passes them to it's local `process/2` function where it pattern
matches on the [event type](https://stripe.com/docs/api/events/types) given from stripe. Right now we only care about
`"product.created"` and `"product.updated"`. In either case, we will perform an [upsert](https://wiki.postgresql.org/wiki/UPSERT)
for the product given to us in the webhook. Remember, our DB is only a local copy of what is in stripe. Stripe is the source
of truth for all our product and pricing information.

Notice how we list prices with `Stripe.Price.list/1`? That's because of how stripe handles the relations between
products & prices. You can read more about it in their guide: https://stripe.com/docs/billing/prices-guide.

## Creating products

Now we have all the setup needed to actually start displaying some products on the page.

First use the stripe-cli to forward webhooks to our server. Run:

```bash
stripe listen --forward-to localhost:4000/webhooks
```

This command will display a webhook signing secret that you'll need to put inside `dev.secret.exs`.

Next you'll want to start up the server with `mix phx.server` and navigate to [`http://localhost:4000/products`](http://localhost:4000/products).
You should see an empty page just like before.

Now open the stripe dashboard and go to your [test products page](https://dashboard.stripe.com/test/products).
Create a product with name, description, and image. Set a one-time price using the `Standard pricing` model.

Once you save that, you should magically see your products page update and display your product 🙌🏻
The cli should show that `product.created` event was sent and you should see a new record in your
database `products` table.

## Add to cart

Earlier we added our HTML for our products page, and you may have noticed on our `Add to cart` button, we included
a `phx-click="add_to_cart"` attribute. This sets us up to handle that button click in elixir, and manage a cart full of products!

Using the awesome powers of phoenix generators again, we're going to create a table
called `cart_items` with a `product_id` column that is a foreign key to our `products` table.

```bash
mix phx.gen.live Store CartItem cart_items product_id:references:products
```

The command again gives us lots of routes to add, but we only need this one for now:

```git
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

```git
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
# lib/amazin_web/live/product_live/index.ex
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

HERE THGLEJSFKLEASJFKLDJSAFKLDJSAFLKEJWQOPG$#JOPT#J$)\_JR\$GE(JSAEF J

## Thank you Page

Before we wire everything up, we're going to build a super simple thank you page to direct users when they successfully checkout.

> The cool thing I've realized about live-view is even though I don't have any "live" parts to this Thank You page,
> it's still fine to build as a live-view because the overhead is minimal, and the semantics are awesome.

For this super simple page, we are going to bypass any generator and instead
create each file manually. The generator just gives us way more boilerplate
than we actually need.

First create a file two new files:

1. `lib/amazin_web/live/cart_live/thank_you.ex`
1. `lib/amazin_web/live/cart_live/thank_you.html.leex`

The first file will be a bare bones live view:

```elixir
# lib/amazin_web/live/cart_live/thank_you.ex
defmodule AmazinWeb.CartLive.ThankYou do
  use AmazinWeb, :live_view

  @impl true
  def mount(_params, _session, socket) do
    {:ok, socket}
  end
end
```

The second file will be the accompanying markup:

```html
<div class="flex flex-col items-center justify-center p-12">
  Thank you for your purchase!
  <br />
  <span class="text-5xl" role="img" alt="hugging emoji">
    🤗
  </span>
</div>
```

Finally a quick update to our router makes this all work:

```git
defmodule AmazinWeb.Router do
  use AmazinWeb, :router
  # ...
  scope "/", AmazinWeb do
    pipe_through :browser

    live "/", ProductsLive.Index, :index
    live "/cart", CartLive.Index, :index
+   live "/cart/thank-you", CartLive.ThankYou, :thank_you
  end
end
```

You can now visit [`http://localhost:4000/cart/thank-you`](http://localhost:4000/cart/thank-you) to see the simple page in action.

## Checkout

Finally we want to actually display these `cart_items` records and allow a user to checkout and pay us.

Hop into our `Store` context again and lets add a query to list all our cart items.

```elixir
# lib/amazin/store.ex

@doc """
Returns the list of cart_items.

## Examples

    iex> list_cart_items()
    [%{}, ...]

"""
def list_cart_items() do
  query =
    from ci in CartItem,
      join: p in Product,
      on: ci.product_id == p.id,
      group_by: p.id,
      select: %{
        total: sum(p.amount),
        stripe_price_id: p.stripe_price_id,
        amount: p.amount,
        quantity: count(ci.id),
        description: p.description,
        name: p.name,
        stock: p.stock,
        thumbnail: p.thumbnail
      }

  Repo.all(query)
end
```

Now we want to create a little dynamic HTML for our cart page. Our phoenix generator we ran a bit ago for cart items gave us a nice
page for our cart at `lib/amazin_web/live/cart_live/index.html.leex`. Lets go replace it's contents with the following:

```elixir
# lib/amazin_web/live/cart_live/index.html.leex

<div class="flex flex-col items-center justify-center p-12">
  <div class="w-1/3 border rounded border-b-0 mb-6">
    <%= for cart_item <- @cart_items do %>
      <div class="flex justify-between p-4 border-b-2">
        <div class="flex">
          <div class="w-6 mr-2">
            <%= cart_item.quantity %> x
          </div>
          <img
            class="w-6 h-6 mr-2"
            src="<%= cart_item.thumbnail %>"
            title="<%= cart_item.name %>"
            alt="<%= cart_item.name %>"
          />
          <div class="text-lg leading-6 font-medium text-gray-900">
            <%= cart_item.name %>
          </div>
        </div>
        <div>
          <%= cart_item.total %>
        </div>
      </div>
    <% end %>
    <div class="flex p-4 border-b-2 justify-end">
      Total: <%= @total %>
    </div>
  </div>
  <button onclick="handleCheckout()" class="focus:outline-none focus:shadow-outline text-lg bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded" >
    Checkout
  </button>
  <script>
    var stripe = Stripe(@stripe_public_key);

    function handleCheckout() {
      stripe.redirectToCheckout({
        sessionId: '<%= @checkout_session_id %>'
      })
    }
  </script>
</div>
```

This renders each product in the cart grouped by product so we can see a nice quantity.
Notice how we load stripe on the page so they can hit checkout.

Now let's add the view code to properly setup the cart for a payment.

```elixir
# lib/amazin_web/live/cart_live/index.ex

defmodule AmazinWeb.CartLive.Index do
  use AmazinWeb, :live_view

  alias Amazin.Store
  alias Amazin.Utils

  @impl true
  def mount(_params, _session, socket) do
    cart_items = Store.list_cart_items()

    total =
      cart_items
      |> Enum.map(&Map.get(&1, :total))
      |> Enum.reduce(0, &Money.add/2)

    args = %{
      mode: "payment",
      payment_method_types: ["card"],
      line_items: Enum.map(cart_items, &to_line_item/1),
      cancel_url: Routes.cart_index_url(AmazinWeb.Endpoint, :index),
      success_url: Routes.cart_thank_you_url(AmazinWeb.Endpoint, :thank_you)
    }

    {:ok, %{id: checkout_session_id}} =
      Stripe.Session.create(args, idempotency_key: idempotency_key(args))

    socket =
      socket
      |> assign(:cart_items, cart_items)
      |> assign(:total, total)
      |> assign(:checkout_session_id, checkout_session_id)
      |> assign(:stripe_public_key, Application.get_env(:amazin, :stripe_public_key))

    {:ok, socket}
  end

  defp to_line_item(%{
         quantity: quantity,
         stripe_price_id: stripe_price_id
       }) do
    %{
      price: stripe_price_id,
      quantity: quantity
    }
  end

  defp idempotency_key(term) do
    UUID.uuid5(nil, inspect(term))
  end
end
```

A few things of note here 👆:

1. We're creating a [stripe checkout session](https://stripe.com/docs/api/checkout/sessions) to setup the user to pay.
1. Notice the [`idempotency_key`](https://stripe.com/docs/api/idempotent_requests) we're passing to `Strpie.Session.create/2`.
   This helps us not create a bunch of orphaned stripe [payment intents](https://stripe.com/docs/api/payment_intents).

Nowww.... 🥁 We can click checkout on the cart page and pay with stripe!

TODO: Sketch our architecture of entire project.
We also need to do a few things when users complete thier checkout session:

1. Remove the items from their cart.
1. Reduce the inventory for the purchaed items.

Let's add both of these to our store context.

```elixir
# lib/amazin/store.ex

@doc """
Reduce the inventory for a product.

## Examples

  iex> reduce_stock("price_123xxx", 2)
  {1, nil}

"""
def reduce_stock(stripe_price_id, quantity) do
  result =
    Product
    |> where(stripe_price_id: ^stripe_price_id)
    |> where([p], p.stock > 0)
    |> Repo.update_all(inc: [stock: -quantity])

  Phoenix.PubSub.broadcast(Amazin.PubSub, "products", :updated)
  result
end

@doc """
Clear the card items.

## Examples

  iex> clear_cart_items()
  {1, nil}

"""
def clear_cart_items do
  Repo.delete_all(CartItem)
end
```

Then we can call them when we get the webhook from stripe.

```elixir
# lib/amazin_web/controllers/webhook_controller.ex
defp process("checkout.session.completed", %Stripe.Session{id: session_id}) do
  with {:ok, %{line_items: %{data: line_items}}} <-
         Stripe.Session.retrieve(session_id, expand: ["line_items"]) do
    line_items
    |> Enum.map(fn li -> {li.price.id, li.quantity} end)
    |> Enum.each(fn {stripe_price_id, quantity} ->
      Store.reduce_stock(stripe_price_id, quantity)
    end)

    Store.clear_cart()

    {:ok, :decremented}
  end
end
```

TODO: Add code for live updates.
TODO: Add empty cart state.

---

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
- Stripe
