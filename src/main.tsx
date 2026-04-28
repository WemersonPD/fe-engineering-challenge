import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        const sw =
          registration.installing ?? registration.waiting ?? registration.active
        if (sw) {
          sw.addEventListener('statechange', (e) => {
            if ((e.target as ServiceWorker).state === 'activated') {
              registration.active?.postMessage('PRECACHE_GEN1')
            }
          })
          // Already activated on subsequent page loads
          if (registration.active) {
            registration.active.postMessage('PRECACHE_GEN1')
          }
        }
      })
      .catch((err) => console.error('SW registration failed:', err))
  })
}
