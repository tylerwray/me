---
title: Stripe Account Setup
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
  title: Stripe Account Setup
imageSrc: ./images/phoenix-stripe-tailwind.jpg
imageAlt: Elixir, Phoenix Live View, Stripe, Tailwind
imageCreditName: Tyler Wray
imageCreditUrl: https://tylerwray.me
---

## Stripe Account Setup

We will need a stripe account to use for our application.

If you have one, login now because we will need our API keys coming up soon.
If you don't, go create one on the [registration page](https://dashboard.stripe.com/register).

## Test it out

To test it out, let's install the stripe CLI which we'll use to receieve webhooks from stripe later.
[Follow the directions here to install and login](https://stripe.com/docs/stripe-cli).

To test that you have it installed properly, try and look at the logs for your account:

```shell
stripe logs tail
```

You should see a `Ready!` message if you correctly installed the CLI and logged into your stripe account.
`Ctrl+c` out of that command, and lets continue 👍🏼
