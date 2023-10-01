---
title: Phoenix App Setup
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
  title: Phoenix App Setup
imageSrc: ./images/phoenix-stripe-tailwind.jpg
imageAlt: Elixir, Phoenix Live View, Stripe, Tailwind
imageCreditName: Tyler Wray
imageCreditUrl: https://tylerwray.me
---

## Install

Use [this guide](https://hexdocs.pm/phoenix/installation.html#content) in the
phoenix docs to Elixir, Erlang, Phoneix, NodeJS, and PostgreSQL.
Thats alot, but trust me it's worth it 🥇.

> If you're running macOS, I highly recommend [Postgres.app](https://postgresapp.com/) to
> run postgres, and [Postico](https://eggerapps.at/postico/) as a nice GUI client.
> Both made by the same wonderful people, at [EggerApps](https://eggerapps.at/about.html) 😍.

## Create the Application

Once you have everything setup, let's run this command to create our application.

```shell
mix phx.new amazin --live
```

Choose `yes` to install dependencies and follow the instructions to start the app.

Once running, let's open [`http://localhost:4000/`](http://localhost:4000/) to see
the phoenix welcome page 😎.

![Phoenix default page](./images/phoenix-default.png "Phoenix default page")

## Install Dependencies

Phoenix has everything you need to deploy to production, including tailwind! There's just a few more
dependencies we need for our specific application:

1. [Money](https://hexdocs.pm/money/Money.html): A currency formatter.
1. [stripity_stripe](https://github.com/code-corps/stripity_stripe): A client library for working with the stripe API.

Add them to your deps in `mix.exs`

```elixir
---
title: mix.exs
---

def deps do
  [
    {:money, "~> 1.12"},
    {:stripity_stripe, "~> 2.17"}
  ]
end
```

> I really like tailwind as a companion to phoenix-live-view because of it's functional-composable nature.
> It makes it really easy to style our live views!

Then run —

```bash
mix deps.get
```

## Configuration

This part is a bit boring... but the payoff is worth it 🤞🏻 We need to add a couple pieces of configuration.

1. We need to tell `stripity_stripe` what our Stripe API key is.
1. We need to tell our `money` package which currency to use by default.

You can grab the Stripe API public and secret keys from the
[stripe developer page](https://dashboard.stripe.com/apikeys) of your stripe account.
Take great care with the secret key, like the name says, it's secret 🤫
Once you have your API keys, create a new file: `config/dev.secret.exs`.

Inside that `config/dev.secret.exs` file, you can now safely add the keys from stripe —

```elixir
---
title: config/dev.secret.exs
---

import Config

config :stripity_stripe, api_key: "YOUR_SECRET_KEY"

config :amazin, stripe_public_key: "YOUR_PUBLIC_KEY"
```

Add `config/dev.secret.exs` to your `.gitignore` —

```shell
---
title: .gitignore
---
# Ignore development secrets
/config/dev.secret.exs
```

In our dev configuration we are going to load that secret file we just created.
Make sure to put this at the very bottom of `config/dev.exs` —

```elixir
---
title: config/dev.exs
---

import_config "dev.secret.exs"
```

Now in the main configuration file we are going to give our default currency. I'm using
USD, but you can use any currency you'd like. A full list can be
found [in the docs of Money](https://hexdocs.pm/money/Money.Currency.html#content).

```elixir
---
title: config/config.exs
---

config :money, default_currency: :USD
```

## Testing it all out

Now you should be able to start the app and communicate with stripe!
Let's test that out. Start an interactive session of your application with:

```bash
iex -S mix
```

Then inside iex, run —

```elixir
iex(1)> Stripe.PaymentIntent.list
```

and you should see something like —

```elixir
{:ok,
 %Stripe.List{
   data: [],
   has_more: false,
   object: "list",
   total_count: nil,
   url: "/v1/payment_intents"
 }}
```

And with that, we are all set up! Now the fun begins 😈
