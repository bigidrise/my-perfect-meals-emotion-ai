// ============================================
// SERVICE WORKER VERSION
// Update this constant when deploying new builds to force mobile refresh
// ============================================
const SW_VERSION = 'v2025-10-24-6pm-fresh';

console.log(`🔧 Service Worker ${SW_VERSION} initializing`);

// ============================================
// PUSH NOTIFICATIONS
// ============================================

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    console.error("Error parsing push data:", error);
  }

  const { title = "🍽️ Meal Reminder", body = "Time for your meal!", data: extra = {} } = data;

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: "/icon-192x192.png",
      badge: "/badge-72x72.png",
      data: extra, // must include { jobId, slot, userId }
      actions: [
        { action: "ate", title: "Ate it" },
        { action: "snooze", title: "Snooze 10m" },
        { action: "skip", title: "Skip" },
      ],
      requireInteraction: true, // stays until user acts
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  const { action } = event;
  const { jobId, slot, userId } = event.notification.data || {};
  event.notification.close();

  // post ack to server for interactive actions
  if (action === "ate" || action === "snooze" || action === "skip") {
    event.waitUntil(fetch("/api/notify/ack", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, jobId, action }),
    }));
    return;
  }

  // default click → open app
  event.waitUntil(clients.openWindow("/weekly"));
});

// ============================================
// LIFECYCLE: INSTALL & ACTIVATE
// ============================================

// Install event - force immediate activation
self.addEventListener("install", (event) => {
  console.log(`✅ Service Worker ${SW_VERSION} installing`);
  self.skipWaiting(); // Activate immediately, don't wait for old SW to close
});

// Activate event - claim all clients immediately
self.addEventListener("activate", (event) => {
  console.log(`✅ Service Worker ${SW_VERSION} activated`);
  
  event.waitUntil(
    Promise.all([
      // Delete any old caches (future-proofing for when we add caching)
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      }),
      // Take control of all pages immediately
      clients.claim()
    ]).then(() => {
      console.log(`✅ Service Worker ${SW_VERSION} now controlling all pages`);
    })
  );
});

// ============================================
// UPDATE MESSAGING
// ============================================

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`📬 Received SKIP_WAITING message, activating ${SW_VERSION}`);
    self.skipWaiting();
  }
});