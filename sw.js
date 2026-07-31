const CACHE_NAME = 'shm-scanner-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json'
];

// Install: ফাইলগুলো ক্যাশে জমা করা
self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate: পুরনো ক্যাশে ডিলিট করা
self.addEventListener('activate', (e) => {
  self.clients.claim();
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME)
        .map((name) => caches.delete(name))
      );
    })
  );
});

// Fetch: অফলাইনে চালানোর জন্য ক্যাশে চেক করা
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // যদি ক্যাশে থাকে তবে সেটিই দেখাবে, না থাকলে নেটওয়ার্ক থেকে আনবে
      return response || fetch(e.request);
    })
  );
});
