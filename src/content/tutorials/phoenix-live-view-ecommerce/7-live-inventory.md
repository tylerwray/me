---
title: Live Updates
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
  title: Live Inventory
imageSrc: ./images/phoenix-stripe-tailwind.jpg
imageAlt: Elixir, Phoenix Live View, Stripe, Tailwind
imageCreditName: Tyler Wray
imageCreditUrl: https://tylerwray.me
---

## Stripe Webhooks

Stripe is the source of truth for our products and their prices. Our DB will be the source of truth for inventory. When stripe products
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
    Store.broadcast_product_updated(:updated, event.data.object)
    :ok
  end

  @impl true
  def handle_event(%Stripe.Event{type: "product.created"} = event) do
    Store.broadcast_product_created(:created, event.data.object)
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

## Add Products

Next you'll want to start up the server with `mix phx.server` and navigate to [`http://localhost:4000/products`](http://localhost:4000/products).
You should see an empty page just like before.

Now open the stripe dashboard and go to your [test products page](https://dashboard.stripe.com/test/products).
Create a product with name, description, and image. Set a one-time price using the `Standard pricing` model.

Once you save that, you should magically see your products page update and display your product 🙌🏻
The cli should show that `product.created` event was sent and you should see a new record in your
database `products` table.
