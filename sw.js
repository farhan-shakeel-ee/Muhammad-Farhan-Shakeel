const CACHE_NAME = "farhan-portfolio-v2";

// Small, render-critical files are installed up front. Images are added only
// when viewed, so a first visit never downloads the full project gallery.
const APP_SHELL = [
  "./",
  "assets/css/variables.css",
  "assets/css/base.css",
  "assets/css/navbar.css",
  "assets/css/hero.css",
  "assets/css/projects.css",
  "assets/css/project-page.css",
  "assets/css/animations.css",
  "assets/css/responsive.css",
  "assets/css/reference-theme.css",
  "assets/js/app.js",
  "assets/js/site.js"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || new URL(event.request.url).origin !== location.origin) return;

  event.respondWith(caches.match(event.request).then(cached => {
    const update = fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    });
    return cached || update;
  }));
});
