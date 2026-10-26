// Service Worker ขั้นต่ำ: ทำให้ติดตั้งแอปลงหน้าจอโฮมได้ (ไม่แคชข้อมูล เพื่อให้ข้อมูล Firebase ใหม่เสมอ)
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  if (e.request.method === 'GET' && new URL(e.request.url).origin === self.location.origin) {
    e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')))
  }
})
