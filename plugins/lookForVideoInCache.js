workbox.routing.registerRoute(
    /mediathek.s3.eu-central-1.wasabisys.com/,
    new workbox.strategies.CacheFirst({
        cacheName: 'video',
    })
);
