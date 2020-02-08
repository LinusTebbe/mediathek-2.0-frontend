workbox.routing.registerRoute(
    /.*\.mp4/,
    new workbox.strategies.CacheFirst({
      cacheName: 'video',
      plugins: [
        new workbox.rangeRequests.Plugin(),
      ],
    })
);