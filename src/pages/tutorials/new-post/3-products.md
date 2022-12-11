---
title: Products Page
description: Some description about Stripe Setup
layout: ../../../layouts/BlogLayout.astro
tags:
  - stripe
  - elixir
  - phoenix live view
  - tailwind
publishedOn: 2022-12-07
isSubpage: true
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---

## Outline

0. [Introduction](../)
1. [Stripe Account Setup](../1-stripe/)
2. [Phoneix App Setup](../2-phoenix-app-setup/)
3. [Products Page](../3-products/)
4. [Add to Cart](../4-add-to-cart/)
5. [Checkout](../5-checkout/)
6. [Live Inventory](../6-live-inventory/)

We are going to create our first simple live view;
A basic navbar with a products grid, each showing a live inventory count.

First thing we need to do is setup our root layout properly. And that starts with
adding our nice navbar.

<div class="bg-gray-800 mb-4">
  <img alt="Amazin logo" title="Amazin logo" src="/assets/images/amazin-logo.svg" />
</div>

Head over to `lib/amazin_web/templates/layout/root.html.leex` and replace the
contents of the `<body />` tag so it looks like this:

```html
<body>
  <nav class="bg-gray-800">
    <div class="px-4 flex items-center">
      <img class="mr-6" src="https://tylerwray.me/amazin-logo.svg" />
      <a href="/" class="px-3 py-2 rounded text-white bg-gray-900">PRODUCTS</a>
      <div class="grow"></div>
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

```diff
scope "/", AmazinWeb do
  pipe_through :browser

+  live "/products", ProductLive.Index, :index
+  live "/products/:id", ProductLive.Show, :show
end
```

Next, we're gunna make one small tweak to the `Product` schema. Change the `amount` field to use the `Money` type to give us nice currency formatting all through the app:

```diff
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
      class="grow p-6 object-contain"
      src="<%= product.thumbnail %>"
      title="<%= product.name %>"
      alt="<%= product.name %>"
    />
    <div class="px-6 py-4 border-t border-gray-400">
      <h3 class="text-lg leading-6 font-medium text-gray-900"><%= product.name %></h3>
      <p class="text-sm text-gray-500"><%= product.description %></p>
    </div>
    <div class="px-6 py-4 border-t border-gray-400 text-xl"><%= product.stock %> remaining</div>
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

![Empty Page](/assets/images/amazin-empty-page.png)

Now let's fill our page with products.

We want the live-view to update itself when relevent events occur. Theres alot of ways we _could_ accomplish that; but turns
out phoneix ships with a really nice way out of the box: [Phoenix.PubSub](https://hexdocs.pm/phoenix_pubsub/Phoenix.PubSub.html)!

First, when our live-view mounts we want to subscribe our view to any product events. If we get notified of
any events via `Pheonix.PubSub.broadcast/2`, the `handle_info/2` function in the module is called.

Lets add these things to our view at `lib/amazin_web/live/product_live/index.ex`:

```diff
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
---
title: lib/amazin_web/router.ex
---

scope "/", AmazinWeb do
  post "/webhooks", WebhookController, :index
end
```

Then we need to parse our webhook bodies and verify that the webhook is actually coming from stripe.
To do that, we are going to create a [plug parser](https://hexdocs.pm/plug/Plug.Parsers.html) and use some nice utilites from `stripity_stripe`.

```elixir
---
title: lib/amazin_web/parsers/webhook_parser.ex
---

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

```diff
---
title: lib/amazin_web/endpoint.ex
---

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
---
title: lib/amazin_web/controllers/webhook_controller.ex
---

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

