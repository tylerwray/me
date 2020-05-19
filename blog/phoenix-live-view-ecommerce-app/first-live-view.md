---
title: How to Build an Ecommerce App with Phoenix LiveView
subTitle: Part 2 - Our first live view
description: This tutorial takes you through building a real world ecommerce application with phoenix liveview. Integrating with Stripe, using tailwindcss, and showing live updates to users.
icon: elixir
tags:
  - elixir
  - phoenix
  - liveview
  - elixir
  - stripe
path: /blog/phoenix-live-view-ecommerce-app/first-live-view
author: Tyler Wray
date: 2020-05-15
banner: images/flight.jpg
bannerCreditName: Ross Parmly
bannerCreditUrl: https://unsplash.com/photos/rf6ywHVkrlY
partOfSeries: true
---

We are going to create our first simple live view;
A basic navbar with product cards, each showing a live inventory count.

## Navbar

First thing we need to do is setup our root layout properly. And that starts with
adding our nice logo.

<div class="bg-gray-800">
  <img alt="Amazin log" title="Amazin logo" src="/amazin-logo.svg" />
</div>

<a href="/amazin-logo.svg" download>Click here to Download logo</a>

Place that logo in `assets/static/images/logo.svg`.

Then head over to `lib/amazin_web/templates/layout/root.html.leex` and replace the
contents of the `<body />` tag so it looks like this:

```html
<body>
  <nav class="bg-gray-800">
    <div class="px-4 flex items-center">
      <img class="mr-6" src="images/logo.svg" />
      <a href="/" class="px-3 py-2 rounded text-white bg-gray-900">PRODUCTS</a>
    </div>
  </nav>
  <%= @inner_content %>
</body>
```

## Generate a Live view

Now we are going to create a new live view using the built in generators
that come with phoenix. If you haven't seen anything like this before,
it may blow your mind.

```bash
mix phx.gen.live Inventory Product products cost:integer description:string name:string stock:integer thumbnail:string upc:string:unique
```

This creates a context called `Inventory`, with a schema called `Product`,
using a table called `products`, with the remaining arguments describing
the data of a `Product`.

> Feel free to explore those files it created and get familiar with them.
> We will be going in and making edits to some of them later.

The generator output shows us all the files it created, instructs us to make
some updates to our router, and run migrations. Let's do that really quick.

```git
scope "/", AmazinWeb do
  pipe_through :browser

+  live "/products", ProductLive.Index, :index
+  live "/products/new", ProductLive.Index, :new
+  live "/products/:id/edit", ProductLive.Index, :edit

+  live "/products/:id", ProductLive.Show, :show
+  live "/products/:id/show/edit", ProductLive.Show, :edit
end
```

Then run:

```bash
mix ecto.migrate
```

Lastly, we need to make one small change to the `cost` field in
`lib/amazin/inventory/product.ex`.

```git
-    field :cost, :integer
+    field :cost, Money.Ecto.Amount.Type
```

Using the `Money.Ecto.Amount.Type` here, we get automatic currency formatting 🙌🏻.

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
in `lib/amazin_web/templates/layout/live.html.eex`, because it conflicts
with the tailwindcss container class. Now its time to make our product list prettier.  
Replace all of `lib/amazin_web/live/product_live/index.html.leex` with

```html
<div class="grid grid-cols-3 gap-8 p-4">
  <%= for product <- @products do %>
  <div class="flex flex-col bg-white border border-gray-400 shadow rounded-lg">
    <img class="flex-grow p-12 object-contain" src="<%= product.thumbnail %>" />
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
      <div class="flex justify-between items-center">
        <%= product.cost %>
        <button
          phx-click="add_to_cart"
          phx-value-upc="<%= product.upc %>"
          class="focus:outline-none focus:shadow-outline text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
  <% end %>
</div>
```

Let's seed our DB with some better data. Let's add the following to `priv/repo/seeds.exs`

<details>
  <summary>Click to expand</summary>

```elixir
alias Amazin.Repo
alias Amazin.Inventory.Product

Repo.insert!(%Product{
  cost: 1295,
  description: "Louisville Slugger premium pine bat.",
  name: "Baseball Bat",
  stock: 10,
  thumbnail: "https://tshop.r10s.com/f32/0d1/b97c/5c3b/a03f/784b/c58d/11e6e999130242ac110004.jpg",
  upc: "000000000000"
})

Repo.insert!(%Product{
  cost: 1295,
  description: "Nike made barcelona soccer ball.",
  name: "Soccer ball",
  stock: 9,
  thumbnail:
    "https://www.soccermaster.com/wp-content/uploads/sc3500_610_nike_barca_20_years_prestige_ball_sm_01.jpg",
  upc: "111111111111"
})

Repo.insert!(%Product{
  cost: 8995,
  description: "Wilson made NFL edition ball.",
  name: "Football",
  stock: 8,
  thumbnail:
    "https://dks.scene7.com/is/image/GolfGalaxy/16WILUNFLGMBLLFFCFTB?qlt=70&wid=600&fmt=pjpeg",
  upc: "222222222222"
})

Repo.insert!(%Product{
  cost: 6995,
  description: "Spalding made NBA edition ball.",
  name: "Basketball",
  stock: 7,
  thumbnail:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTMDLpR4ALSBJtVOBvcyJ9aLQxs-lw0Fw1fPnPKYFKweJwSK59eEbpYQ62xoycotREN77aAB9JY&usqp=CAc",
  upc: "333333333333"
})

Repo.insert!(%Product{
  cost: 12399,
  description: "StringKing Complete 2 Pro Offense Womens Lacrosse Stick | Bar Down Lacrosse",
  name: "Lacrosse Stick",
  stock: 6,
  thumbnail:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Crossed_lacrosse_sticks_skinny.svg/1200px-Crossed_lacrosse_sticks_skinny.svg.png",
  upc: "444444444444"
})

Repo.insert!(%Product{
  cost: 24995,
  description: "American Athletic Shoe Women's Leather Lined Ice Skates",
  name: "Ice Skates",
  stock: 5,
  thumbnail: "https://images-na.ssl-images-amazon.com/images/I/31vmND6WbEL._AC_.jpg",
  upc: "555555555555"
})

Repo.insert!(%Product{
  cost: 799,
  description: "Penn Extra-Duty Championship Tennis Balls",
  name: "Tennis balls",
  stock: 4,
  thumbnail:
    "https://www.gophersport.com/cmsstatic/img/117/G-51119-PennExtra-DutyChampionship-ce-11.jpg",
  upc: "666666666666"
})

Repo.insert!(%Product{
  cost: 8799,
  description: "Surgeon RX3.1 Ice Hockey Stick",
  name: "Hockey Stick",
  stock: 3,
  thumbnail:
    "https://www.stx.com/media/catalog/product/cache/c7d685abe37f4d15c439fdc154c3cbf1/s/u/surgeon_rx3.1_front.png",
  upc: "777777777777"
})

Repo.insert!(%Product{
  cost: 18549,
  description: "Kyrie 6 'Enlightenment' Basketball Shoe",
  name: "Basketball Shoes",
  stock: 2,
  thumbnail:
    "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto/cd6f7b5f-ad1d-48a8-b129-1f9d3f1bf72e/kyrie-6-enlightenment-basketball-shoe-1zgG18.jpg",
  upc: "888888888888"
})

Repo.insert!(%Product{
  cost: 38549,
  description:
    "Ram Golf Accubar 16pc Golf Clubs Set - Graphite Shafted Woods, Steel Shafted Irons - Mens Right Hand",
  name: "Golf Clubs",
  stock: 1,
  thumbnail:
    "https://res-1.cloudinary.com/s247/image/upload/c_pad,dpr_1.0,f_auto,h_800,q_auto,w_800/media/catalog/product/r/a/ram_16pc_mensrh_2.jpg",
  upc: "999999999999"
})
```

</details>

<br />

Then run

```bash
mix run priv/repo/seeds.exs
```

Finally, if you start up the server again and go to
[`http://localhost:4000/products`](http://localhost:4000/products),
you should see a wonderful little grid of all your products 🥰

![Nice Finished Grid](/images/pretty-grid.png)

## Take a breath

![Take a breath](https://media.giphy.com/media/wOIhQl355kxTlgVfhI/giphy.gif "Breathing focus")

Wow that was alot. Let's quickly recap before we move onto the next section.

### Accomplishments 🏆

- Learned about phoenix generators
- Built our first live view
- Built some awesome UI tailwindcss

### Tech used 💻

- Elixir
- Postgres
- Phoenix Live View
- Tailwindcss

### What's next? ➡️

- Live remaining inventory updates.
- Full stack reactive programing with stripe webhooks
