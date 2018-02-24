// Listen for install event, set callback
self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open("cache").then(function (cache) {
            return cache.addAll(
                [
                    "/",
                    "/icon.png",
                    "/icons.css",
                    "/index.html",
                    "/index.js",
                    "/manifest.json",
                    "/service-worker.js",
                    "/style.css",
                    "/fonts/icomoon.eot?1qgahv",
                    "/fonts/icomoon.eot?1qgahv#iefix",
                    "/fonts/icomoon.ttf?1qgahv",
                    "/fonts/icomoon.woff?1qgahv",
                    "/fonts/icomoon.svg?1qgahv#icomoon"
                ]
            );
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});