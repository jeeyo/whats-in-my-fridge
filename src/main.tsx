import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { register } from 'register-service-worker'

register('./notification.worker.js', {
  ready (registration) {
    console.log('Service worker is active.')

    // @ts-expect-error Argument of type '"periodicsync"' is not assignable to parameter of type 'keyof WindowEventMap'
    registration.periodicSync.register('notify-expiry', { minInterval: 24 * 60 * 60 * 1000 });
  },
  registered (_registration) {
    console.log('Service worker has been registered.')
  },
  cached (_registration) {
    console.log('Content has been cached for offline use.')
  },
  updatefound (_registration) {
    console.log('New content is downloading.')
  },
  updated (_registration) {
    console.log('New content is available; please refresh.')
  },
  offline () {
    console.log('No internet connection found. App is running in offline mode.')
  },
  error (error) {
    console.error('Error during service worker registration:', error)
  }
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
