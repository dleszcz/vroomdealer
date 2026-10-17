// Service Worker dla VroomScout Admin PWA
const CACHE_NAME = 'vroom-admin-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Obsługa Web Push (iOS 16.4+ & Android)
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (err) {
    data = {
      title: 'Nowy lead w VroomScout!',
      body: event.data ? event.data.text() : 'Sprawdź nowe zgłoszenie pojazdu.',
    };
  }

  const title = data.title || '🚗 Nowy lead odkupu!';
  const options = {
    body: data.body || 'Pojawiło się nowe auto do odkupu w VroomScout.',
    icon: '/logo.png',
    badge: '/logo.png',
    data: {
      url: data.url || '/admin',
    },
    vibrate: [200, 100, 200],
    tag: 'vroom-lead-' + Date.now(),
    renotify: true,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Kliknięcie w powiadomienie
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/admin';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
