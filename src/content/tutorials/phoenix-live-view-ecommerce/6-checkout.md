---
title: Checkout
description: Some description about Stripe Setup
tags:
  - stripe
  - elixir
  - phoenix
  - tailwindcss
publishedOn: 2022-12-07
draft: true
tutorial:
  slug: live_view_ecommerce
  title: Checkout
imageSrc: ./images/phoenix-stripe-tailwind.jpg
imageAlt: Elixir, Phoenix Live View, Stripe, Tailwind
imageCreditName: Tyler Wray
imageCreditUrl: https://tylerwray.me
---

Finally we want to actually display these `cart_items` records and allow a user to checkout and pay us.

Hop into our `Store` context again and lets add a query to list all our cart items formatted for the checkout with stripe —

```elixir
---
title: lib/amazin/store.ex
---

defmodule Amazin.Store do
  #..

  @doc """
  Returns the list of cart items formatted for checkout.

  ## Examples

      iex> list_cart_items_for_checkout()
      [%{}, ...]

  """
  def list_cart_items_for_checkout do
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
end
```

Our phoenix generator we ran a bit ago for cart items gave us a simple page for our cart, but we can make it better.
Lets go replace it's contents with the following —

```heex
---
title: lib/amazin_web/live/cart_live/index.html.heex
---
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
            src={cart_item.thumbnail}
            title={cart_item.name}
            alt={cart_item.name}
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
  <button
    phx-click="checkout"
    class="focus:outline-none focus:shadow-outline text-lg bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded"
  >
    Checkout
  </button>
</div>
```

This renders each product in the cart grouped by product so we can see a nice quantity.
Notice how we load stripe on the page so they can hit checkout.

Now let's add the view code to properly setup the cart for a payment.

```elixir
---
title: lib/amazin_web/live/cart_live/index.ex
---

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
---
title: lib/amazin/store.ex
---

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
---
title: lib/amazin_web/controllers/webhook_controller.ex
---

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
---
title: lib/amazin_web/live/cart_live/thank_you.ex
---

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
  <span class="text-5xl" role="img" alt="hugging emoji"> 🤗 </span>
</div>
```

Finally a quick update to our router makes this all work:

```diff
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
