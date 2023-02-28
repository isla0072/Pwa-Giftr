const version = 1;
const cacheName = 'giftr-cache';
let isOnline = true;
const cacheItems = [
  '/',
  '/index.html',
  '/js/app.js',
  '/js/cache.js',
  '/manifest.json',
  '/css/style.css',
  'https://fonts.googleapis.com/css2?family=Montserrat&display=swap'
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        cache.addAll(cacheItems);
      })
  );
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(keys.filter((nm) => nm !== cacheName).map((nm) => caches.delete(nm)));
      })
  );
});

self.addEventListener('fetch', (ev) => {
  let req = ev.request;
  let url = new URL(ev.request.url);
  let mode = ev.request.mode;
  let pathname = url.pathname;
  let isOnline = navigator.onLine;

  let okFiles =  
  url.pathname.includes('.png') ||
  url.pathname.includes('.jpg') ||
  url.pathname.includes('.css') ||
  url.pathname.includes('.html') ||
  url.pathname.includes('.js') ||
  url.pathname.includes('.index') ||
  url.pathname.includes('.json');

  if (isOnline) {
    if (okFiles) {
    ev.respondWith(cacheFirst(ev));
  } else {
    ev.respondWith(networkFirst(ev));
  }
} else {
      ev.respondWith(cacheOnly(ev));
    }

});

function cacheFirst(ev) {
  return caches.match(ev.request).then((cacheResponse) => {
    let fetchResponse = fetch(ev.request).then((response) => {
      caches.open(cacheName).then((cache) => {
        cache.put(ev.request, response.clone());
        if (!response.ok) throw new NetworkError('Something is wrong', response);
        return response;
      });
    });
    return cacheResponse || fetchResponse;
  });
};

function cacheOnly(ev) {
  return caches.match(ev.request);
}

function networkFirst(ev) {
  return fetch(ev.request).then((response) => {
    if (!response.ok) return caches.match(ev.request);
    return response;
  });
}