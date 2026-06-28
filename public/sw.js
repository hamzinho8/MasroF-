self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const targetUrl = event.notification.data ? event.notification.data.url : '/?tab=bank';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes('/') && 'focus' in client) {
          // Tell the client to navigate to the bank tab
          client.postMessage({ type: 'NAVIGATE', path: 'bank' });
          return client.focus();
        }
      }
      // If no window is open, open a new one with the bank tab query param
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

self.addEventListener('push', function(event) {
  // Required if we want push events, though we are using Notification Triggers or Alarms
});
