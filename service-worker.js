const CACHE_NAME = "tarefas-cache-v2";

const urlsToCache = [
  "./",
  "./index.html",
  "./assets/css/style.css",
  "./assets/js/script.js"
];

// Instala e cria cache
self.addEventListener("install", (event) => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Remove caches antigos
self.addEventListener("activate", (event) => {

  event.waitUntil(
    caches.keys().then((cacheNames) => {

      return Promise.all(
        cacheNames.map((cache) => {

          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }

        })
      );

    })
  );

  self.clients.claim();
});

// Busca recursos
self.addEventListener("fetch", (event) => {

  event.respondWith(

    caches.match(event.request)
      .then((response) => {

        return response || fetch(event.request);

      })

  );

});
