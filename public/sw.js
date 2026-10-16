// Service Worker for Bartender Recipe PWA
const CACHE_NAME = "bar-prep-v1";

// Core static assets required for offline functionality
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon.svg",
  "/src/main.ts",
  "/src/styles/themes.css",
  "/src/data/cocktails.json",
];

// 1. Install Event: Cache core application shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting()),
  );
});

// 2. Activate Event: Clean up outdated cache versions
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              return caches.delete(cache);
            }
            return Promise.resolve();
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// 3. Fetch Event: Serve cached assets first, fall back to network
self.addEventListener("fetch", (event) => {
  // Only handle GET requests
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately
        return cachedResponse;
      }

      // Fall back to fetching from network and dynamically cache the new resource
      return fetch(event.request)
        .then((networkResponse) => {
          // Check for a valid response
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== "basic"
          ) {
            return networkResponse;
          }

          // Clone response stream before caching
          const responseToCache = networkResponse.clone();
          // Add 'void' before caches.open
          void caches.open(CACHE_NAME).then((cache) => {
            return cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // Fallback response for navigation requests when offline
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return Promise.reject("Offline asset not found in cache");
        });
    }),
  );
});
