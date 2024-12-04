self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'notify-expiry') {
    registration.showNotification('Hello there')
    event.waitUntil(Promise.resolve(1))
  }
})
