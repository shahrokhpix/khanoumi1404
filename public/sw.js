const CACHE_NAME = "khanoumi-v1";
const ASSET_EXTS = /\.(woff2?|ttf|otf|png|jpe?g|webp|svg|gif|ico|pdf)(\?.*)?$/i;
const JS_CSS = /\.(js|css)(\?.*)?$/i;

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;

  // Fonts, images, PDFs → cache-first (serve stale instantly, refresh in background)
  if (ASSET_EXTS.test(path)) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => cached ?? Response.error());
        return cached ?? fetchPromise;
      })
    );
    return;
  }

  // JS/CSS bundles → cache-first (filenames are content-hashed, safe to cache forever)
  if (JS_CSS.test(path)) {
    e.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
      })
    );
    return;
  }

  // HTML (SPA navigation) → network-first, stale fallback
  e.respondWith(
    fetch(request)
      .then((res) => {
        if (res.ok) {
          caches.open(CACHE_NAME).then((c) => c.put(request, res.clone()));
        }
        return res;
      })
      .catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        // fallback to any cached HTML (SPA handles routing)
        return (await cache.match(request)) ??
               (await cache.match(self.registration.scope)) ??
               Response.error();
      })
  );
});
