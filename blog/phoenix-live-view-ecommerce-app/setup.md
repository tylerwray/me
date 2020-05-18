---
title: How to Build an Ecommerce App with Phoenix LiveView
subTitle: Part 1 - Setup
icon: elixir
tags:
  - elixir
  - phoenix
  - liveview
  - elixir
  - stripe
path: /blog/phoenix-live-view-ecommerce-app/setup
author: Tyler Wray
date: 2020-05-15
banner: images/setup.jpg
bannerCreditName: bantersnaps
bannerCreditUrl: https://unsplash.com/photos/QuOvcitE5uY
partOfSeries: true
---

Let's get set up first thing, and then we can go onto greater things.

## Create a New Phoenix App

Use [this guide](https://hexdocs.pm/phoenix/installation.html#content) in the
phoenix docs to get Elixir, Erlang, Phoneix, NodeJS, and PostgreSQL setup.
Thats alot, but trust me it's worth it 🥇.

> If you're running macOS, I highly recommend [Postgres.app](https://postgresapp.com/) to
> run postgres, and [Postico](https://eggerapps.at/postico/) as a nice GUI client.
> Both made by the same wonderful people, at [EggerApps](https://eggerapps.at/about.html) 😍.

Once you have everything setup, let's run this command to create our application.

```bash
mix phx.new amazin --live
```

Choose `yes` to install dependencies and follow the instructions to start the app.

Once running, let's open [`http://localhost:4000`](http://localhost:4000) to see the phoenix welcome page 😎.

![Phoenix default page](./images/phoenix-default.png "Phoenix default page")

## Stripe Account Setup

We will need a stripe account to use for our application.

If you have one, login now because we will need our API keys coming up soon.
If you don't, go create one on the [registration page](https://dashboard.stripe.com/register).

## Install Dependencies

We're going to need two dependencies for our application:

1. [stripity_stripe](https://github.com/code-corps/stripity_stripe): A client library for working with the stripe API.
2. [Money](https://hexdocs.pm/money/Money.html): A currency formatter.

Add them to your deps in `mix.exs`

```elixir
def deps do
  [
    {:stripity_stripe, "~> 2.0.0"},
    {:money, "~> 1.4"}
  ]
end
```

Then run

```bash
mix deps.get
```

## Configure Stripe API Key

In order to communicate with stripe, we need an api key. You can grab the api secret key from the [stripe developer page](https://dashboard.stripe.com/apikeys) of your stripe account.
Take great care with this key, like the name says, it's secret 🤫

Once we have it, we'll need to load it into the application somehow.
I like to create a `config/dev.secret.exs` file, and load it in my dev config `config/dev.exs` with this line at the bottom:

```elixir
import_config "dev.secret.exs"
```

And don't forget to add `config/dev.secret.exs` to your `.gitignore`!

Inside that `config/dev.secret.exs` file, you can now safely add the api key from stripe:

```elixir
use Mix.Config

config :stripity_stripe, api_key: "YOUR_SECRET_KEY"
```

## Installing tailwindcss

Now we're going to setup [tailwindcss](https://tailwindcss.com/) to work with liveview. I really like tailwind as a companion to liveview
because of it's utility-first nature. It makes it really easy to style our live views and components.

First we need to install some Javascript modules.

```bash
npm install --prefix assets postcss-loader tailwindcss
```

We're using [`postcss-loader`](https://postcss.org/) to load tailwind, so lets do that by creating a new file at `assets/postcss.config.js`
with the contents:

```javascript
module.exports = {
  plugins: [require("tailwindcss")],
}
```

Then add the `postcss-loader` to the css rule in `assets/webpack.config.js`

```git
{
  test: /\.[s]?css$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader",
    "sass-loader",
    "postcss-loader",
  ],
}
```

## Testing it all out

Now you should be able to start the app and communicate with stripe!
Let's test that out.

Start an interactive session of your application with:

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

### Accomplishments 🏆

- Setup a new phoenix live view app
- Setup tailwindcss for proper user in our phoenix app
- Setup a stripe account and made API calls with elixir

### Tech used 💻

- Elixir
- Phoenix Framework
- Postgres
- Tailwindcss

### What's next? ➡️

- Unleash the power of phoenix generators
- Build our first phoenix liveview page using tailwindcss

[On Part 2 💪](first-live-view)
