---
title: Live View eCommerce
description: Learn phoenix live view by building a real-world eCommerce application that can actually process payments!
layout: ../../../layouts/TutorialLayout.astro
tags:
  - stripe
  - elixir
  - phoenix live view
  - tailwind
publishedOn: 2022-12-07
draft: true
tutorial: 
  slug: live_view_ecommerce
  title: Introduction
  homePage: true
image:
  src: /assets/images/phoenix-stripe-tailwind.jpg
  alt: Elixir, Phoenix Live View, Stripe, Tailwind
  creditName: Tyler Wray
  creditUrl: https://tylerwray.me
---

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

