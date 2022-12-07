// 2022-12-6: Ship this Javascript to clear the cache and remove service workers
// from my old site.
// IDK When I can remove this... but hopefully soon-ish?

// Clear cache
self.addEventListener("activate", function (event) {
  // @ts-ignore
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)))
      )
  );
});

self.addEventListener("install", (e) => {
  // @ts-ignore
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  // @ts-ignore
  self.registration
    .unregister()
    // @ts-ignore
    .then(() => self.clients.matchAll())
    // @ts-ignore
    .then((clients) => {
      // @ts-ignore
      clients.forEach((client) => client.navigate(client.url));
    });
});
