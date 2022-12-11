---
title: Live View eCommerce
description: Learn phoenix live view by building a real-world eCommerce application that can actually process payments!
layout: ../../../layouts/BlogLayout.astro
tags:
  - stripe
  - elixir
  - phoenix live view
  - tailwind
publishedOn: 2022-12-07
draft: true
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---

## Outline

0. [Introduction](./)
1. [Stripe Account Setup](./1-stripe/)
2. [Phoneix App Setup](./2-phoenix-app-setup/)
3. [Products Page](./3-products/)
4. [Add to Cart](./4-add-to-cart/)
5. [Checkout](./5-checkout/)
6. [Live Inventory](./6-live-inventory/)

## Introduction

I've heard alot about [Phoenix LiveView](https://github.com/phoenixframework/phoenix_live_view) from co-workers and twitter,
so I wanted to actually build something to test it's merit. At it's core, Phoenix LiveView is a framework for writing
real-time web UI's in a declarative fashion, using a programming langauage loved by many; [Elixir](https://elixir-lang.org/).

We're going to build an ecommerce application powered by [Stripe](https://stripe.com) and Phoenix LiveView. Along the way learning
about the problems Phoenix LiveView solves, some basics of Stripe, cool tailwindcss features, and a bit about reactive programming,

The tech we will use in this tutorial —

- Elixir
- Phoenix Framework
- Postgres
- Tailwindcss
- Stripe

_TODO_ Insert architecture diagram.

At the end of this tutorial you will have accomplished —

- Setup of a new phoenix live view app.
- Setup of tailwindcss for proper user in our phoenix app.
- Setup of a stripe account and made API calls with elixir.
- Learning about phoenix generators.
- Building some awesome UI tailwindcss.
- Building a reactive phoenix live view.

This tutorial is broken into multiple stages, outlined below —

This is going to be fun, let's dive in.

