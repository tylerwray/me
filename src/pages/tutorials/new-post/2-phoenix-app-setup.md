---
title: Phoenix App Setup
description: Some description about Stripe Setup
layout: ../../../layouts/TutorialLayout.astro
tags:
  - elixir
  - phoenix
  - phoenix live view
  - tailwind
publishedOn: 2022-12-07
tutorial:
  slug: live_view_ecommerce
  title: Phoenix App Setup
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---

Use [this guide](https://hexdocs.pm/phoenix/installation.html#content) in the
phoenix docs to Elixir, Erlang, Phoneix, NodeJS, and PostgreSQL.
Thats alot, but trust me it's worth it 🥇.

> If you're running macOS, I highly recommend [Postgres.app](https://postgresapp.com/) to
> run postgres, and [Postico](https://eggerapps.at/postico/) as a nice GUI client.
> Both made by the same wonderful people, at [EggerApps](https://eggerapps.at/about.html) 😍.

Once you have everything setup, let's run this command to create our application.

```shell
mix phx.new amazin --live
```

Choose `yes` to install dependencies and follow the instructions to start the app.

Once running, let's open [`http://localhost:4000/`](http://localhost:4000/) to see
the phoenix welcome page 😎.

![Phoenix default page](/assets/images/amazin-phoenix-default.png "Phoenix default page")

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
---
title: config/dev.secret.exs
---

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

Now for tailwindcss configuration. This is going to the be the most javascript
you write in this guide, I promise. We're using [`postcss-loader`](https://postcss.org/)
to load tailwind, so lets do that by creating a new file at `assets/postcss.config.js`
with the contents:

```javascript
---
title: assets/postcss.config.js
---

module.exports = {
  plugins: [require("tailwindcss")],
};
```

Then add the `postcss-loader` to the css rule in `assets/webpack.config.js`

```diff
---
title: assets/webpack.config.js
---

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
