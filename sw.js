const CACHE_NAME = 'riki-store-v3';

// যে ফাইলগুলো অফলাইনে দেখানোর জন্য সেভ করা হবে
const urlsToCache = [
  'index.html',
  'admin.html',
  'manifest.json'
];

// PWA install হওয়ার সময় এই কোড রান হবে
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// যখন অ্যাপ কোনো ফাইল রিকোয়েস্ট করবে, তখন এই কোড রান হবে
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // যদি ফাইল ক্যাশে পাওয়া যায়, তবে সেখান থেকে দেখাবে
        // না পাওয়া গেলে ইন্টারনেট থেকে আনবে
        return response || fetch(event.request);
      })
  );
});

// PWA এর নতুন ভার্সন এলে পুরনো ক্যাশ ডিলিট করার জন্য
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
